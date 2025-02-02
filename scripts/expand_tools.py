import os
import json
import requests
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

if not all([OPENROUTER_API_KEY]):
    raise ValueError("Please ensure all environment variables are set in .env file")

def read_ts_file(file_path: str) -> List[Dict[str, Any]]:
    """Read and parse a TypeScript file containing tool definitions."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the array content between export const and the end
    array_start = content.find('export const')
    if array_start == -1:
        raise ValueError(f"Could not find 'export const' in {file_path}")
    
    # Find the equals sign after export const
    equals_pos = content.find('=', array_start)
    if equals_pos == -1:
        raise ValueError(f"Could not find array assignment in {file_path}")
    
    # Find the array start after the equals sign
    array_start = content.find('[', equals_pos)
    array_end = content.rfind(']')
    
    if array_start == -1 or array_end == -1:
        raise ValueError(f"Could not find array in {file_path}")
    
    array_content = content[array_start:array_end + 1]
    
    # Clean up TypeScript-specific syntax
    # Remove trailing commas after objects
    array_content = array_content.replace(',\n    }', '\n    }')
    array_content = array_content.replace(',\n]', '\n]')
    
    # Handle potential single quotes
    array_content = array_content.replace("'", '"')
    
    # Convert TypeScript property shorthand to JSON format
    lines = array_content.split('\n')
    formatted_lines = []
    for line in lines:
        # Add quotes around property names if they don't have them
        if ':' in line and '"' not in line.split(':')[0]:
            prop = line.split(':')[0].strip()
            rest = ':'.join(line.split(':')[1:])
            line = f'        "{prop}":{rest}'
        formatted_lines.append(line)
    
    array_content = '\n'.join(formatted_lines)
    
    try:
        return json.loads(array_content)
    except json.JSONDecodeError as e:
        print(f"Error parsing {file_path}: {e}")
        print("Content that failed to parse:")
        print(array_content)
        return []

def get_new_tools(category: str, example_tool: Dict[str, Any], existing_tools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Use OpenRouter API to generate new tools based on existing ones."""
    existing_tool_names = [tool['name'] for tool in existing_tools]
    
    prompt = f"""You are a software development expert. Based on the following example tool format and category '{category}', 
    suggest 3 new tools that are not in the existing list. Format the response as a JSON array.
    
    Example tool format:
    {json.dumps(example_tool, indent=2)}
    
    Existing tools (do not include these):
    {', '.join(existing_tool_names)}
    
    Please provide 3 new tools in the exact same JSON format as the example. Ensure all fields match the example format,
    including proper types for dates, scores, and arrays. Make sure the tools are real and the information is accurate.
    Return only the JSON array with no additional text."""

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://github.com/yourusername/coding_mapper",  # Optional but good practice
                "X-Title": "Coding Mapper"  # Optional but good practice
            },
            json={
                "model": "anthropic/claude-3-sonnet",  # Using Claude 3 for better structured output
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
        )
        
        if response.status_code != 200:
            print(f"API request failed with status code: {response.status_code}")
            print("Response content:", response.text)
            raise Exception(f"API request failed: {response.text}")
        
        result = response.json()
        print("\nAPI Response:", json.dumps(result, indent=2))  # Debug print
        
        if 'choices' not in result:
            print("Unexpected API response format. Missing 'choices' key.")
            print("Full response:", json.dumps(result, indent=2))
            return []
        
        if not result['choices']:
            print("API response contains empty choices array")
            return []
        
        content = result['choices'][0].get('message', {}).get('content', '')
        if not content:
            print("No content found in API response")
            return []
        
        # Try to extract JSON array from the content
        # Sometimes the model might include markdown code block markers
        content = content.strip()
        if content.startswith('```json'):
            content = content[7:]
        if content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()
        
        tools = json.loads(content)
        if not isinstance(tools, list):
            print("API response is not a JSON array")
            return []
        
        return tools
        
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        print("Content that failed to parse:", content)
        return []
    except Exception as e:
        print(f"Error making API request: {e}")
        return []

def update_ts_file(file_path: str, new_tools: List[Dict[str, Any]]):
    """Update the TypeScript file with new tools."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the position before the last closing bracket
    insert_pos = content.rfind(']')
    if insert_pos == -1:
        raise ValueError(f"Could not find closing bracket in {file_path}")
    
    # Convert new tools to TypeScript format with unquoted keys
    def format_tool(tool: Dict[str, Any]) -> str:
        lines = ['    {']
        for key, value in tool.items():
            # Format the value based on its type
            if isinstance(value, str):
                formatted_value = f"'{value}'"  # Use single quotes for strings
            elif isinstance(value, list):
                if all(isinstance(x, str) for x in value):
                    # Format string arrays with single quotes
                    formatted_value = f"[{', '.join(f"'{x}'" for x in value)}]"
                else:
                    formatted_value = json.dumps(value)
            else:
                formatted_value = json.dumps(value)
            
            # Add the key-value pair without quotes around the key
            lines.append(f"        {key}: {formatted_value},")
        lines.append('    }')
        return '\n'.join(lines)
    
    new_tools_str = ',\n'.join(format_tool(tool) for tool in new_tools)
    
    # Insert new tools
    new_content = content[:insert_pos] + ',\n' + new_tools_str + content[insert_pos:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    try:
        # Directory containing tool category files
        tools_dir = Path(__file__).parent.parent / 'src' / 'data' / 'tools'
        
        if not tools_dir.exists():
            print(f"Error: Tools directory not found at {tools_dir}")
            return
        
        # Get list of all category files
        category_files = list(tools_dir.glob('*.ts'))
        category_files = [f for f in category_files if f.stem not in ['index', 'types']]
        
        if not category_files:
            print("No category files found in the tools directory")
            return
        
        print("\nAvailable categories:")
        for i, file in enumerate(category_files, 1):
            print(f"{i}. {file.stem}")
        
        try:
            choice = int(input("\nSelect category number to expand: ")) - 1
            if not 0 <= choice < len(category_files):
                print("Invalid choice. Please select a number from the list.")
                return
        except ValueError:
            print("Please enter a valid number")
            return
        
        selected_file = category_files[choice]
        print(f"\nProcessing {selected_file.name}...")
        
        # Read existing tools
        try:
            existing_tools = read_ts_file(selected_file)
            if not existing_tools:
                print(f"No valid tools found in {selected_file.name}. Please check the file format.")
                return
        except ValueError as e:
            print(f"Error reading file: {e}")
            return
        
        # Use the first tool as an example
        example_tool = existing_tools[0]
        
        print(f"\nFound {len(existing_tools)} existing tools in {selected_file.name}")
        print("Generating new tools using OpenRouter API...")
        
        # Get new tools from API
        try:
            new_tools = get_new_tools(selected_file.stem, example_tool, existing_tools)
            if new_tools:
                print(f"\nGenerated {len(new_tools)} new tools:")
                for tool in new_tools:
                    print(f"- {tool['name']}")
                
                confirm = input("\nDo you want to add these tools to the database? (y/n): ")
                if confirm.lower() == 'y':
                    update_ts_file(selected_file, new_tools)
                    print("\nTools added successfully!")
            else:
                print("No new tools were generated. Please check the API response.")
        except Exception as e:
            print(f"\nError while generating new tools: {str(e)}")
            if "API request failed" in str(e):
                print("\nPlease check your OpenRouter API key and internet connection.")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {str(e)}")
        print("If the problem persists, please check the file formats and API configuration.")

if __name__ == "__main__":
    main() 