import { PaymentsSystem } from "./model";
import { PaymentSystemDTO } from "./dto";
import { ReviseListDTO } from "../revise-object";

export function mapPaymentSystem(
  system: PaymentsSystem,
  dto: PaymentSystemDTO
): PaymentsSystem {
  return {
    ...system,
    idField: dto.result.field_id,
    opType: dto.result.field_type,
    date: dto.result.field_date,
    project: dto.result.field_project,
    amount: dto.result.field_sum,
    currency: dto.result.field_currency,
  };
}

export function mapPaymentsSystem(
  dto: ReviseListDTO | null | undefined
): PaymentsSystem[] {
  return (
    dto?.result
      .filter((rev) => !!rev.id_ps)
      .map((rev) => ({
        id: rev.id_ps!,
        name: rev.name,
        filesCount: rev.files.length,
      })) || []
  );
}
