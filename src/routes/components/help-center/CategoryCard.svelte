<script lang="ts">
	import {
		User,
		Lightbulb,
		Briefcase,
		Shield,
		CreditCard,
		type Icon as LucideIcon
	} from '@lucide/svelte';
	import { scale } from 'svelte/transition';

	interface Props {
		category: {
			id: string;
			title: string;
			icon: string;
			description?: string;
		};
		isActive?: boolean;
		onClick?: () => void;
	}

	let { category, isActive = false, onClick }: Props = $props();

	const iconMap: Record<string, typeof LucideIcon> = {
		user: User,
		lightbulb: Lightbulb,
		briefcase: Briefcase,
		shield: Shield,
		'credit-card': CreditCard
	};

	const IconComponent = iconMap[category.icon] || User;
</script>

<button
	type="button"
	onclick={onClick}
	class="group relative flex w-full flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-300 {isActive
		? 'border-principal-4 bg-principal-4/5 shadow-lg shadow-principal-4/20'
		: 'border-gray-200 bg-white hover:border-principal-4/50 hover:shadow-md'}"
	aria-pressed={isActive}
	transition:scale={{ duration: 200 }}
>
	<div
		class="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 {isActive
			? 'bg-principal-4 text-white'
			: 'bg-principal-2 text-principal-6 group-hover:bg-principal-3'}"
	>
		<IconComponent size={28} />
	</div>

	<div class="text-center">
		<h3
			class="text-lg font-bold transition-colors duration-300 {isActive
				? 'text-principal-6'
				: 'text-gray-800 group-hover:text-principal-5'}"
		>
			{category.title}
		</h3>
		{#if category.description}
			<p class="mt-1 text-sm font-medium text-gray-500">{category.description}</p>
		{/if}
	</div>

	{#if isActive}
		<div
			class="bg-principal-4 absolute -bottom-1 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full"
			transition:scale={{ duration: 200 }}
		></div>
	{/if}
</button>
