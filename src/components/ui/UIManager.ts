import { Node } from '../../data/types';
import { categories } from '../../data/categories';

export class UIManager {
    private currentInfoBox: HTMLElement | null = null;

    public showNodeInfo(node: Node): void {
        this.removeExistingInfoBox();
        this.createInfoBox(node);
    }

    private removeExistingInfoBox(): void {
        if (this.currentInfoBox) {
            this.currentInfoBox.remove();
            this.currentInfoBox = null;
        }
    }

    private createInfoBox(node: Node): void {
        const infoBox = document.createElement('div');
        infoBox.id = 'node-info';
        this.setupInfoBoxStyles(infoBox);

        const category = categories.find(c => c.id === node.category);
        
        infoBox.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: ${category?.color}">${node.name}</h3>
            <p style="margin: 0 0 10px 0">${node.description}</p>
            <p style="margin: 0; color: ${category?.color}">Category: ${category?.name}</p>
        `;

        document.body.appendChild(infoBox);
        this.currentInfoBox = infoBox;
    }

    private setupInfoBoxStyles(infoBox: HTMLElement): void {
        Object.assign(infoBox.style, {
            position: 'fixed',
            right: '20px',
            top: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '300px',
            zIndex: '1000',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        });
    }
} 