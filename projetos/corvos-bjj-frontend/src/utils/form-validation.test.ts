import {
  validateGradePayload,
  validatePaymentPayload,
  validateStudentPayload,
} from '@/utils/form-validation';

describe('form-validation', () => {
  it('validates student payload', () => {
    expect(validateStudentPayload({ name: '', email: 'x@y.com' })).toContain('Nome');
    expect(validateStudentPayload({ name: 'João', email: 'invalid' })).toContain('E-mail inválido');
    expect(validateStudentPayload({ name: 'João', email: 'joao@email.com' })).toBeNull();
  });

  it('validates payment payload', () => {
    expect(
      validatePaymentPayload({
        studentId: '',
        amount: 0,
        dueDate: '',
      })
    ).toContain('Aluno');

    expect(
      validatePaymentPayload({
        studentId: '1',
        amount: 150,
        dueDate: '2026-03-04',
        referenceMonth: '03-2026',
      })
    ).toContain('YYYY-MM');

    expect(
      validatePaymentPayload({
        studentId: '1',
        amount: 150,
        dueDate: '2026-03-04',
        referenceMonth: '2026-03',
      })
    ).toBeNull();
  });

  it('validates grade payload', () => {
    expect(validateGradePayload({ beltColor: 'branca', promotionDate: '' })).toContain('Data');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);

    expect(validateGradePayload({ beltColor: 'branca', promotionDate: tomorrowIso })).toContain(
      'futuro'
    );

    expect(validateGradePayload({ beltColor: 'azul', promotionDate: '2026-03-01' })).toBeNull();
  });
});
