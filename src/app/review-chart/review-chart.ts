import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-section">
      <div #chartContainer class="chart-container"></div>
    </div>
  `
})
export class ReviewChartComponent implements AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges() {
    if (this.chartContainer) {
      this.renderChart();
    }
  }

  private renderChart() {
    if (!this.chartContainer || !this.data || this.data.length === 0) return;

    const container = this.chartContainer.nativeElement;
    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1000 400');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('style', 'display: block; margin: 0 auto;');

    // Padding
    const padding = { top: 40, right: 60, bottom: 60, left: 80 };
    const width = 1000 - padding.left - padding.right;
    const height = 400 - padding.top - padding.bottom;

    // Trouver les min/max
    const maxCommentaires = Math.max(...this.data.map(d => d.commentairesCumulatifs), 5);
    const maxNote = 5;

    // Créer le groupe principal
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);

    // Grille
    this.drawGrid(g, width, height, maxCommentaires);

    // Axes
    this.drawAxes(g, width, height);

    // Courbes
    this.drawCurves(g, width, height, maxCommentaires, maxNote);

    // Labels des axes
    this.drawAxisLabels(g, width, height, maxCommentaires);

    // Légende
    this.drawLegend(g, width, height);

    svg.appendChild(g);
    container.appendChild(svg);
  }

  private drawGrid(g: SVGGElement, width: number, height: number, maxCommentaires: number) {
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('stroke', '#e0e0e0');
    gridGroup.setAttribute('stroke-width', '1');

    // Lignes horizontales
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', String(y));
      line.setAttribute('x2', String(width));
      line.setAttribute('y2', String(y));
      gridGroup.appendChild(line);
    }

    g.appendChild(gridGroup);
  }

  private drawAxes(g: SVGGElement, width: number, height: number) {
    // Axe X
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0');
    xAxis.setAttribute('y1', String(height));
    xAxis.setAttribute('x2', String(width));
    xAxis.setAttribute('y2', String(height));
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    g.appendChild(xAxis);

    // Axe Y
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '0');
    yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '0');
    yAxis.setAttribute('y2', String(height));
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '2');
    g.appendChild(yAxis);
  }

  private drawCurves(g: SVGGElement, width: number, height: number, maxCommentaires: number, maxNote: number) {
    if (this.data.length === 0) return;

    const stepX = width / (this.data.length - 1 || 1);

    // ===== COURBE COMMENTAIRES =====
    let pathDataCommentaires = '';
    this.data.forEach((item, i) => {
      const x = i * stepX;
      // Inverser Y car SVG va du haut vers le bas
      const y = height - (item.commentairesCumulatifs / maxCommentaires) * height;
      pathDataCommentaires += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });

    const pathCommentaires = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathCommentaires.setAttribute('d', pathDataCommentaires);
    pathCommentaires.setAttribute('stroke', '#007bff');
    pathCommentaires.setAttribute('stroke-width', '3');
    pathCommentaires.setAttribute('fill', 'none');
    pathCommentaires.setAttribute('stroke-linecap', 'round');
    pathCommentaires.setAttribute('stroke-linejoin', 'round');
    g.appendChild(pathCommentaires);

    // ===== COURBE NOTE MOYENNE =====
    let pathDataNote = '';
    this.data.forEach((item, i) => {
      const x = i * stepX;
      const y = height - (item.noteMoyenne / maxNote) * height;
      pathDataNote += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });

    const pathNote = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathNote.setAttribute('d', pathDataNote);
    pathNote.setAttribute('stroke', '#ff8000');
    pathNote.setAttribute('stroke-width', '3');
    pathNote.setAttribute('fill', 'none');
    pathNote.setAttribute('stroke-linecap', 'round');
    pathNote.setAttribute('stroke-linejoin', 'round');
    g.appendChild(pathNote);

    // ===== POINTS ET TOOLTIPS =====
    this.data.forEach((item, i) => {
      const x = i * stepX;
      
      // Point commentaires
      const yC = height - (item.commentairesCumulatifs / maxCommentaires) * height;
      const circleC = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleC.setAttribute('cx', String(x));
      circleC.setAttribute('cy', String(yC));
      circleC.setAttribute('r', '5');
      circleC.setAttribute('fill', '#007bff');
      circleC.setAttribute('stroke', 'white');
      circleC.setAttribute('stroke-width', '2');
      circleC.setAttribute('class', 'data-point');
      circleC.setAttribute('style', 'cursor: pointer;');
      circleC.setAttribute('title', `${item.month}: ${item.commentairesCumulatifs} commentaire${item.commentairesCumulatifs > 1 ? 's' : ''}`);
      g.appendChild(circleC);

      // Point note
      const yN = height - (item.noteMoyenne / maxNote) * height;
      const circleN = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleN.setAttribute('cx', String(x));
      circleN.setAttribute('cy', String(yN));
      circleN.setAttribute('r', '5');
      circleN.setAttribute('fill', '#ff8000');
      circleN.setAttribute('stroke', 'white');
      circleN.setAttribute('stroke-width', '2');
      circleN.setAttribute('class', 'data-point');
      circleN.setAttribute('style', 'cursor: pointer;');
      circleN.setAttribute('title', `${item.month}: Note ${item.noteMoyenne}/5`);
      g.appendChild(circleN);
    });
  }

  private drawAxisLabels(g: SVGGElement, width: number, height: number, maxCommentaires: number) {
    // Labels X (mois)
    const stepX = width / (this.data.length - 1 || 1);
    this.data.forEach((item, i) => {
      const x = i * stepX;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(x));
      text.setAttribute('y', String(height + 25));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-weight', '500');
      text.textContent = item.month;
      g.appendChild(text);
    });

    // Labels Y gauche (commentaires)
    for (let i = 0; i <= 5; i++) {
      const ratio = i / 5;
      const value = Math.round(ratio * maxCommentaires);
      const y = height - (ratio * height);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '-10');
      text.setAttribute('y', String(y + 5));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-weight', '500');
      text.textContent = String(value);
      g.appendChild(text);
    }

    // Labels Y droite (notes)
    for (let i = 0; i <= 5; i++) {
      const ratio = i / 5;
      const value = (ratio * 5).toFixed(1);
      const y = height - (ratio * height);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(width + 15));
      text.setAttribute('y', String(y + 5));
      text.setAttribute('text-anchor', 'start');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-weight', '500');
      text.textContent = value;
      g.appendChild(text);
    }

    // Titres des axes
    const titleLeft = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleLeft.setAttribute('x', '-' + String(height / 2));
    titleLeft.setAttribute('y', '-40');
    titleLeft.setAttribute('text-anchor', 'middle');
    titleLeft.setAttribute('font-size', '14');
    titleLeft.setAttribute('fill', '#007bff');
    titleLeft.setAttribute('font-weight', '600');
    titleLeft.setAttribute('transform', 'rotate(-90)');
    titleLeft.textContent = 'Commentaires';
    g.appendChild(titleLeft);

    const titleRight = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleRight.setAttribute('x', String(height / 2));
    titleRight.setAttribute('y', String(width + 40));
    titleRight.setAttribute('text-anchor', 'middle');
    titleRight.setAttribute('font-size', '14');
    titleRight.setAttribute('fill', '#ff8000');
    titleRight.setAttribute('font-weight', '600');
    titleRight.setAttribute('transform', `translate(${width + 50}, 0) rotate(90)`);
    titleRight.textContent = 'Note moyenne';
    g.appendChild(titleRight);
  }

  private drawLegend(g: SVGGElement, width: number, height: number) {
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('transform', `translate(${width - 200}, 10)`);

    // Rectangle de fond
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '200');
    rect.setAttribute('height', '70');
    rect.setAttribute('fill', 'white');
    rect.setAttribute('stroke', '#ddd');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('rx', '4');
    rect.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
    legendGroup.appendChild(rect);

    // Ligne commentaires
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '10');
    line1.setAttribute('y1', '20');
    line1.setAttribute('x2', '30');
    line1.setAttribute('y2', '20');
    line1.setAttribute('stroke', '#007bff');
    line1.setAttribute('stroke-width', '3');
    legendGroup.appendChild(line1);

    const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text1.setAttribute('x', '40');
    text1.setAttribute('y', '25');
    text1.setAttribute('font-size', '13');
    text1.setAttribute('font-weight', '600');
    text1.setAttribute('fill', '#333');
    text1.textContent = 'Commentaires';
    legendGroup.appendChild(text1);

    // Ligne note
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '10');
    line2.setAttribute('y1', '50');
    line2.setAttribute('x2', '30');
    line2.setAttribute('y2', '50');
    line2.setAttribute('stroke', '#ff8000');
    line2.setAttribute('stroke-width', '3');
    legendGroup.appendChild(line2);

    const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text2.setAttribute('x', '40');
    text2.setAttribute('y', '55');
    text2.setAttribute('font-size', '13');
    text2.setAttribute('font-weight', '600');
    text2.setAttribute('fill', '#333');
    text2.textContent = 'Note moyenne';
    legendGroup.appendChild(text2);

    g.appendChild(legendGroup);
  }
}