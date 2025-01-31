import run from '../';
import fs from 'fs';

describe('Basic run tests', () => {
	beforeAll(() => {
		run(['src/Example.ts', 'ExampleType']);
	});

	afterAll(() => {
		fs.unlinkSync(`src/Example.validator.ts`);
	});
	test('run', async () => {
		const { default: validate } = await import('../Example.validator');
		const test1 = { value: 'ddd', answer: 1 };
		validate(test1);
	});

	test('valid', async () => {
		const { default: validate } = await import('../Example.validator');
		expect(
			validate({
				value: 'Hello World',
			}),
		).toMatchSnapshot();
		expect(
			validate({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
	});

	test('invalid', async () => {
		const { default: validate } = await import('../Example.validator');
		expect(() => validate({})).toThrowErrorMatchingSnapshot();
		expect(() =>
			validate({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
	});
});

describe('Basic run tests with separate schema file', () => {
	const moduleName = 'ExamplePermissiveSeparate.validator';
	beforeAll(() => {
		run(['--separateSchemaFile', '--output', `src/${moduleName}.ts`, 'src/Example.ts', 'ExampleType']);
	});

	afterAll(() => {
		fs.unlinkSync(`src/${moduleName}.ts`);
		fs.unlinkSync(`src/${moduleName}.json`);
	});
	test('run 1', async () => {
		const { default: validate } = await import(`../${moduleName}`);
		const test1 = { value: 'ddd', answer: 1 };
		validate(test1);
	});

	test('valid', async () => {
		const { default: validate } = await import('../Example.validator');
		expect(
			validate({
				value: 'Hello World',
			}),
		).toMatchSnapshot();
		expect(
			validate({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
	});

	test('invalid', async () => {
		const { default: validate } = await import('../Example.validator');
		expect(() => validate({})).toThrowErrorMatchingSnapshot();
		expect(() =>
			validate({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
	});
});

describe('Basic run tests with cleaner', () => {
	const moduleName = 'ExamplePermissiveSingle.validator';
	beforeAll(() => {
		run(['--noExtraProps', '--generatePermissive', '--output', `src/${moduleName}.ts`, 'src/Example.ts', 'ExampleType']);
	});

	afterAll(() => {
		fs.unlinkSync(`src/${moduleName}.ts`);
	});
	test('run', async () => {
		const { default: validate, cleanAndValidate } = await import(`../${moduleName}`);
		const test1 = { value: 'ddd', answer: 1 };
		validate(test1);
		cleanAndValidate({ ...test1, extra: 1 });
	});

	test('valid', async () => {
		const { default: validate } = await import('../Example.validator');
		expect(
			validate({
				value: 'Hello World',
			}),
		).toMatchSnapshot();
		expect(
			validate({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
	});

	test('invalid', async () => {
		const { default: validate } = await import('../Example.validator');
		expect(() => validate({})).toThrowErrorMatchingSnapshot();
		expect(() =>
			validate({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
	});
});

describe('Basic run tests collection', () => {
	const moduleName = 'ExampleCollection.validator';
	beforeAll(() => {
		run(['--collection', '--output', `src/${moduleName}.ts`, 'src/Example.ts']);
	});

	afterAll(() => {
		fs.unlinkSync(`src/${moduleName}.ts`);
	});
	test('run', async () => {
		const { validate } = await import(`../${moduleName}`);
		const test1 = { value: 'ddd', answer: 1 };
		validate('ExampleType')(test1);
	});

	test('valid', async () => {
		const { validate } = await import(`../${moduleName}`);
		expect(
			validate('ExampleType')({
				value: 'Hello World',
			}),
		).toMatchSnapshot();
		expect(
			validate('ExampleType')({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
	});

	test('invalid', async () => {
		const { validate } = await import(`../${moduleName}`);
		expect(() => validate('ExampleType')({})).toThrowErrorMatchingSnapshot();
		expect(() =>
			validate('ExampleType')({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
	});
});

describe('Basic run tests collection with separate schema file', () => {
	const moduleName = 'ExampleCollectionSeparate.validator';
	beforeAll(() => {
		run(['--separateSchemaFile', '--collection', '--output', `src/${moduleName}.ts`, 'src/Example.ts']);
	});

	afterAll(() => {
		fs.unlinkSync(`src/${moduleName}.ts`);
		fs.unlinkSync(`src/${moduleName}.json`);
	});

	test('run', async () => {
		const { validate } = await import(`../${moduleName}`);
		const test1 = { value: 'ddd', answer: 1 };
		validate('ExampleType')(test1);
	});

	test('valid', async () => {
		const { validate } = await import(`../${moduleName}`);
		expect(
			validate('ExampleType')({
				value: 'Hello World',
			}),
		).toMatchSnapshot();
		expect(
			validate('ExampleType')({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
	});

	test('invalid', async () => {
		const { validate } = await import(`../${moduleName}`);
		expect(() => validate('ExampleType')({})).toThrowErrorMatchingSnapshot();
		expect(() =>
			validate('ExampleType')({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
	});
});

describe('Permissive run tests collection', () => {
	const moduleName = 'ExamplePermissive.validator';
	beforeAll(() => {
		run(['--noExtraProps', '--generatePermissive', '--collection', '--output', `src/${moduleName}.ts`, 'src/Example.ts']);
	});

	afterAll(() => {
		fs.unlinkSync(`src/${moduleName}.ts`);
	});

	test('run Permissive', async () => {
		const { validate, cleanAndValidate } = await import(`../${moduleName}`);
		const test1 = { value: 'ddd', answer: 1 };
		validate('ExampleType')(test1);
		cleanAndValidate('ExampleType')(test1);
	});

	test('Clean Extra', async () => {
		const { validate, cleanAndValidate } = await import(`../${moduleName}`);
		const test1 = { value: 'ddd', answer: 1, foo: 'bar' };
		const cleaned = cleanAndValidate('ExampleType')({ ...test1 });
		expect(cleaned).toMatchSnapshot();
		expect(() => validate('ExampleType')(test1)).toThrowErrorMatchingSnapshot();
	});

	test('valid', async () => {
		const { validate, cleanAndValidate } = await import(`../${moduleName}`);
		expect(
			validate('ExampleType')({
				value: 'Hello World',
			}),
		).toMatchSnapshot();
		expect(
			cleanAndValidate('ExampleType')({
				value: 'Hello World',
			}),
		).toMatchSnapshot();

		expect(
			validate('ExampleType')({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
		expect(
			cleanAndValidate('ExampleType')({
				value: 'Hello World',
				email: 'forbes@lindesay.co.uk',
			}),
		).toMatchSnapshot();
	});

	test('invalid', async () => {
		const { validate, cleanAndValidate } = await import(`../${moduleName}`);
		expect(() => validate('ExampleType')({})).toThrowErrorMatchingSnapshot();
		expect(() => cleanAndValidate('ExampleType')({})).toThrowErrorMatchingSnapshot();
		expect(() =>
			validate('ExampleType')({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
		expect(() =>
			cleanAndValidate('ExampleType')({
				email: 'forbeslindesay.co.uk',
			}),
		).toThrowErrorMatchingSnapshot();
	});
});
