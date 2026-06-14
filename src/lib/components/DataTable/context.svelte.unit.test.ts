import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock svelte's context API before importing the module under test
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn()
}));

import { getContext, setContext } from 'svelte';
import { getDataTableContext, setDataTableContext } from './context';
import type { IDataTableStore } from './stores/dataTable.svelte';

const mockStore = {} as IDataTableStore;

beforeEach(() => {
	vi.clearAllMocks();
});

describe('setDataTableContext', () => {
	it('should call setContext with the store when invoked', () => {
		setDataTableContext(mockStore);

		expect(setContext).toHaveBeenCalledOnce();
		expect(setContext).toHaveBeenCalledWith(expect.any(Symbol), mockStore);
	});
});

describe('getDataTableContext', () => {
	it('should return the store when context has been set', () => {
		vi.mocked(getContext).mockReturnValue(mockStore);

		const result = getDataTableContext();

		expect(result).toBe(mockStore);
	});

	it('should call getContext with a Symbol key when invoked', () => {
		vi.mocked(getContext).mockReturnValue(mockStore);

		getDataTableContext();

		expect(getContext).toHaveBeenCalledOnce();
		expect(getContext).toHaveBeenCalledWith(expect.any(Symbol));
	});

	it('should throw an error when context has not been set', () => {
		vi.mocked(getContext).mockReturnValue(undefined);

		expect(() => getDataTableContext()).toThrow(
			'DataTable store not found in context. Make sure to use <DataTable> as the parent component.'
		);
	});
});
