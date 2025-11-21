<script>
	import { Button, Label } from 'bits-ui';
	import { ChevronLeft } from '@lucide/svelte';

	let { data } = $props();
	let { profile } = $derived(data);
</script>

<Button.Root
	href="../"
	class="bg-principal-1 hover:bg-principal-4 mt-4 ml-4 inline-block rounded-full border-2 border-black shadow hover:border-black/80"
>
	<ChevronLeft class="size-10 stroke-1 hover:stroke-black/80" />
</Button.Root>

<div class="flex w-full justify-center">
	<form
		method="post"
		action="?/signup"
		class=" flex w-lg flex-col items-stretch gap-8 rounded-md border border-zinc-300 p-8 shadow-lg"
	>
		<h2 class="text-2xl font-bold">PERFIL</h2>
		<div class="flex flex-col items-start gap-1">
			<Label.Root for="name" class="text-sm font-medium">Nome Completo:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="name"
					value={profile?.name}
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
		</div>
		<div class="flex flex-col items-start gap-1">
			<Label.Root for="name" class="text-sm font-medium">Descrição:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="descricao"
					value={profile?.description}
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
		</div>
		<div class="flex flex-col items-start gap-1">
			<Label.Root for="date" class="text-sm font-medium">Data para o trabalho:</Label.Root>
			<div class="w-full">
				<input
					type="date"
					min={new Date().toISOString().split('T')[0]}
					value={profile?.date}
					name="date"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
		</div>
		<div class="flex flex-col items-start gap-1">
			<Label.Root for="phone" class="text-sm font-medium">Telefone:</Label.Root>
			<div class="w-full">
				<input
					type="text"
					name="phone"
					value={profile?.phone}
					placeholder="(00)00000-0000"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
		</div>
		<div class="flex flex-col items-start gap-1">
			<Label.Root for="email" class="text-sm font-medium">Email:</Label.Root>
			<div class="w-full">
				<input
					type="email"
					name="email"
					value={data.user?.email}
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
		</div>
		<div class="flex flex-col items-start gap-1">
			<Label.Root for="password" class="text-sm font-medium">Senha:</Label.Root>
			<div class="flex w-full flex-col gap-4">
				<input
					type="password"
					name="password"
					placeholder="Nova senha"
					class="bg-principal-1 placeholder:text-foreground-alt/50 inline-flex h-10 w-full items-center rounded-sm border border-zinc-300 px-4 text-base focus:ring-2 focus:ring-offset-2 focus:outline-hidden sm:text-sm"
				/>
			</div>
		</div>
		<div class="flex w-full justify-center">
			<Button.Root
				class="bg-principal-5 hover:bg-principal-3 inline-flex h-10 items-center justify-center rounded-lg px-12 font-semibold text-black shadow-sm transition-colors duration-300 active:scale-[0.95]"
			>
				Atualizar
			</Button.Root>
		</div>
	</form>
</div>
