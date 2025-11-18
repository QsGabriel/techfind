<script>
	let { size = '30px', color = '#ffe8b4' } = $props();
</script>

<div class="spinner text-principal-2" style="--size: {size}; --color: {color}"></div>

<style>
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid var(--color);
		border-radius: 50%;
		width: var(--size);
		height: var(--size);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
