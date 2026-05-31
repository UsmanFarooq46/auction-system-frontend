import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pkrCurrency',
  standalone: true
})
export class PkrCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value === null || value === undefined) return 'Rs 0';

    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(value);
  }
}
