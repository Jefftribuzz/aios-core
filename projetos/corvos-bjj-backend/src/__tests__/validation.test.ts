import {
	validateBeltColor,
	validateEmail,
	validatePassword,
	validatePaymentStatus,
	validatePhone,
	validateStudentStatus,
} from '../utils/validation';

describe('Validation utilities', () => {
	it('validates email correctly', () => {
		expect(validateEmail('professor@corvosbjj.com').valid).toBe(true);
		expect(validateEmail('invalid-email').valid).toBe(false);
	});

	it('validates password policy', () => {
		expect(validatePassword('Senha123').valid).toBe(true);
		expect(validatePassword('senha123').valid).toBe(false);
		expect(validatePassword('SenhaSemNumero').valid).toBe(false);
		expect(validatePassword('a1B').valid).toBe(false);
	});

	it('validates phone format', () => {
		expect(validatePhone('11999998888').valid).toBe(true);
		expect(validatePhone('123').valid).toBe(false);
		expect(validatePhone('abc12345678').valid).toBe(false);
	});

	it('validates belt colors', () => {
		expect(validateBeltColor('azul').valid).toBe(true);
		expect(validateBeltColor('preta').valid).toBe(true);
		expect(validateBeltColor('rosa').valid).toBe(false);
	});

	it('validates payment status', () => {
		expect(validatePaymentStatus('pago').valid).toBe(true);
		expect(validatePaymentStatus('pendente').valid).toBe(true);
		expect(validatePaymentStatus('cancelado').valid).toBe(false);
	});

	it('validates student status', () => {
		expect(validateStudentStatus('ativo').valid).toBe(true);
		expect(validateStudentStatus('inativo').valid).toBe(true);
		expect(validateStudentStatus('ferias').valid).toBe(false);
	});
});

