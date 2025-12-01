import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface CotasPendentesData {
  meses: number;
  dataVencimento: string;
  valorTotal: number;
  nomeMembro: string;
}

@Component({
  selector: 'app-cotas-pendentes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cotas-pendentes-dialog.component.html',
  styleUrls: ['./cotas-pendentes-dialog.component.scss']
})
export class CotasPendentesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CotasPendentesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CotasPendentesData
  ) {}

  onPagar(): void {
    this.dialogRef.close('pagar');
  }

  onFechar(): void {
    this.dialogRef.close('fechar');
  }

  getMesesTexto(): string {
    // Calcular quais meses devem ser pagos (últimos N meses a partir do mês atual)
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const hoje = new Date();
    const mesAtual = hoje.getMonth(); // 0-11 (Janeiro = 0, Dezembro = 11)
    const anoAtual = hoje.getFullYear();
    
    const mesesDevidos: string[] = [];
    // Pegar os últimos N meses antes do mês atual
    for (let i = this.data.meses - 1; i >= 0; i--) {
      const mesIndex = (mesAtual - i + 12) % 12;
      // Se o mês calculado está depois do mês atual no ciclo do ano, é do ano anterior
      // Exemplo: se estamos em Janeiro (0) e o mês calculado é Novembro (10), é do ano anterior
      const ano = mesIndex > mesAtual ? anoAtual - 1 : anoAtual;
      mesesDevidos.push(`${meses[mesIndex]} ${ano}`);
    }
    
    return mesesDevidos.join(', ');
  }
}

