<script>
	import CryptoJS from 'crypto-js';
	import { jsPDF } from 'jspdf';
	import html2canvas from 'html2canvas-pro';
	import { page } from '$app/stores';

	const {
		contract = {
			data_ini: '',
			prazo: '',
			objetivo: '',
			valor: '',
			assinatura_creator_hash: '',
			contracted: { name: '' },
			creator: { name: '' }
		}
	} = $props();

	let contractData = $state({
		data_ini: contract.data_ini,
		prazo: contract.prazo,
		objetivo: contract.objetivo,
		valor: contract.valor,
		contractor: {
			name: contract.contracted?.name,
			address: 'Rua Comercial, 123, São Paulo, SP',
			type: '12.345.678/0001-00'
		},
		employee: {
			name: contract.creator?.name,
			address: 'Avenida Residencial, 456, São Paulo, SP',
			type: '123.456.789-00'
		},
		signature: '',
		signatureHash: contract.assinatura_creator_hash
	});

	let isValid = $derived(
		contractData.data_ini && contractData.prazo && contractData.objetivo && contractData.valor
	);
	let isSigned = $state(contract.assinatura_creator_hash ? true : false);
	let formattedValue = $state('');
	let contractElement = $state();
	let isLoading = $state(false);

	$inspect('signed: ', isSigned, 'assinatura: ', contract.assinatura_creator_hash);
	$inspect(contract);

	$effect(() => {
		if (contractData.valor) {
			formattedValue = new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(Number(contractData.valor));
		}
	});

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR');
	}

	function generateSignatureHash() {
		const timestamp = new Date().getTime();
		const randomString = Math.random().toString(36).substring(7);
		const dataToHash = `${timestamp}-${randomString}-${contractData.employee.name}`;
		contractData.signatureHash = CryptoJS.SHA256(dataToHash).toString();
		isSigned = true;
	}

	function handleSign() {
		if (!contractData.signature) {
			alert('Por favor, forneça sua assinatura');
			return;
		}
		generateSignatureHash();
	}

	async function downloadPDF() {
		const canvas = await html2canvas(contractElement, {
			scale: 1,
			useCORS: true,
			logging: false
		});

		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF('p', 'mm', 'a4');
		const pageWidth = pdf.internal.pageSize.getWidth();
		const ratio = canvas.width / canvas.height;
		const imgWidth = pageWidth - 20;
		const imgHeight = imgWidth / ratio;
		pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
		pdf.save('contrato-trabalho.pdf');
	}
</script>

<div class="contract-page">
	<div class="contract-content" bind:this={contractElement}>
		<div class="contract-document">
			<div class="document-header">
				<div class="logo">TECHFIND</div>
				<h1>CONTRATO DE TRABALHO</h1>
				<div class="document-number">
					Nº {Math.floor(Math.random() * 10000)
						.toString()
						.padStart(4, '0')}/2024
				</div>
			</div>

			<section class="parties">
				<h3>PARTES CONTRATANTES</h3>
				<div class="party-info">
					<p>
						<strong>CONTRATANTE:</strong>
						{contractData.contractor.name}<br />
						Endereço: {contractData.contractor.address}<br />
						CNPJ: {contractData.contractor.type}
					</p>

					<p>
						<strong>CONTRATADO:</strong>
						{contractData.employee.name}<br />
						Endereço: {contractData.employee.address}<br />
						CPF: {contractData.employee.type}
					</p>
				</div>
			</section>

			<section class="terms">
				<h3>CLÁUSULAS E CONDIÇÕES</h3>

				<div class="clause">
					<h4>CLÁUSULA PRIMEIRA - OBJETO DO CONTRATO</h4>
					<p>{contractData.objetivo || '[Objeto pendente]'}</p>
				</div>

				<div class="clause">
					<h4>CLÁUSULA SEGUNDA - VIGÊNCIA</h4>
					<p>
						O presente contrato terá início em {formatDate(contractData.data_ini) ||
							'[Data pendente]'}, com duração de {contractData.prazo || '[Prazo pendente]'} meses.
					</p>
				</div>

				<div class="clause">
					<h4>CLÁUSULA TERCEIRA - VALOR E PAGAMENTO</h4>
					<p>
						Pela prestação dos serviços, o CONTRATADO receberá o valor de {formattedValue ||
							'[Valor pendente]'}.
					</p>
				</div>

				<div class="clause">
					<h4>CLÁUSULA QUARTA - DISPOSIÇÕES GERAIS</h4>
					<p>
						O presente contrato representa o acordo integral entre as partes e substitui quaisquer
						entendimentos ou acordos anteriores.
					</p>
				</div>
			</section>

			<section class="signatures">
				<h3>LOCAL, DATA E ASSINATURAS</h3>
				<p class="location-date">São Paulo, {new Date().toLocaleDateString('pt-BR')}</p>

				{#if isSigned || contractData.signatureHash}
					<div class="signature-area">
						<div class="signature-line">
							<p class="signature-name">{contractData.contractor.name}</p>
							<p class="signature-title">CONTRATADO</p>
						</div>
						<div class="signature-line">
							<p class="signature-name">{contractData.employee.name}</p>
							<p class="signature-title">CONTRATANTE</p>
						</div>
						<div class="signature-hash">
							<small>Hash de Verificação: {contractData.signatureHash}</small>
						</div>
					</div>
				{/if}
			</section>
		</div>
	</div>

	{#if !contract.id}
		<form method="POST" action="?/create">
			<div class="sidebar">
				<h2>Detalhes do Contrato</h2>
				<div class="form-group">
					<label for="data_ini">Data de Início</label>
					<input type="date" name="data_ini" bind:value={contractData.data_ini} />
				</div>
				<div class="form-group">
					<label for="prazo">Prazo (meses)</label>
					<input type="number" name="prazo" bind:value={contractData.prazo} min="1" />
				</div>
				<div class="form-group">
					<label for="objetivo">Objeto do Contrato</label>
					<textarea
						name="objetivo"
						bind:value={contractData.objetivo}
						rows="4"
						placeholder="Descreva o objeto do contrato..."
					></textarea>
				</div>
				<div class="form-group">
					<label for="valor">Valor do Contrato (R$)</label>
					<input
						type="number"
						name="valor"
						bind:value={contractData.valor}
						min="0"
						step="0.01"
						placeholder="0,00"
					/>
				</div>

				{#if !isSigned}
					<div class="signature-input">
						<label for="assinatura">Assinatura Digital</label>
						<input
							type="text"
							name="assinatura"
							bind:value={contractData.signature}
							placeholder="Digite seu nome completo como assinatura"
						/>
						<button onclick={handleSign} disabled={!isValid}>Assinar Contrato</button>
					</div>
				{/if}
				<input type="hidden" name="assinatura_hash" value={contractData.signatureHash} />
				<input type="hidden" name="id_creator" value={$page.data.profile.id} />

				<div class="contract-actions">
					<button class="action-button" onclick={downloadPDF} disabled={!isValid}>
						Baixar PDF
					</button>
					<button
						type="submit"
						class="action-button submit-button"
						disabled={!isValid || !isSigned}
					>
						Enviar Contrato
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>

<style>
	:global(body) {
		font-family: 'Montserrat', sans-serif;
	}

	.contract-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 0;
		min-height: 100%;
	}

	@media (min-width: 1024px) {
		.contract-page {
			flex-direction: row;
			gap: 2rem;
		}
	}

	.sidebar {
		width: 100%;
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		order: 2;
	}

	:global(.dark) .sidebar {
		background: rgb(31 41 55);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	@media (min-width: 1024px) {
		.sidebar {
			width: 350px;
			position: sticky;
			top: 1rem;
			height: fit-content;
			order: 1;
			max-height: calc(100vh - 2rem);
			overflow-y: auto;
		}
	}

	.contract-content {
		flex: 1;
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		order: 1;
	}

	:global(.dark) .contract-content {
		background: rgb(31 41 55);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	@media (min-width: 768px) {
		.contract-content {
			padding: 2.5rem;
		}
	}

	@media (min-width: 1024px) {
		.contract-content {
			order: 2;
		}
	}

	.contract-document {
		max-width: 100%;
		margin: 0 auto;
		line-height: 1.6;
		color: rgb(17 24 39);
	}

	:global(.dark) .contract-document {
		color: rgb(243 244 246);
	}

	@media (min-width: 768px) {
		.contract-document {
			max-width: 700px;
		}
	}

	.document-header {
		text-align: center;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #d95518 0%, #ff6800 100%);
		color: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(217, 85, 24, 0.2);
	}

	@media (min-width: 768px) {
		.document-header {
			margin-bottom: 3rem;
			padding: 2rem;
		}
	}

	.logo {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		letter-spacing: 2px;
	}

	@media (min-width: 768px) {
		.logo {
			font-size: 2rem;
		}
	}

	.document-header h1 {
		font-size: 1.4rem;
		font-weight: 600;
		margin: 0;
		color: white;
	}

	@media (min-width: 768px) {
		.document-header h1 {
			font-size: 1.8rem;
		}
	}

	.document-number {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.9);
	}

	@media (min-width: 768px) {
		.document-number {
			font-size: 1rem;
		}
	}

	.party-info {
		background: rgb(249 250 251);
		padding: 1.25rem;
		border-radius: 8px;
		margin: 1rem 0;
		border-left: 4px solid #ff6800;
	}

	:global(.dark) .party-info {
		background: rgb(55 65 81);
	}

	@media (min-width: 768px) {
		.party-info {
			padding: 1.5rem;
		}
	}

	.clause {
		margin-bottom: 1.5rem;
	}

	@media (min-width: 768px) {
		.clause {
			margin-bottom: 2rem;
		}
	}

	.clause h4 {
		color: #d95518;
		margin-bottom: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}

	:global(.dark) .clause h4 {
		color: #ff6800;
	}

	@media (min-width: 768px) {
		.clause h4 {
			font-size: 1.1rem;
		}
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	@media (min-width: 768px) {
		.form-group {
			margin-bottom: 1.5rem;
		}
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		color: rgb(55 65 81);
	}

	:global(.dark) .form-group label {
		color: rgb(229 231 235);
	}

	input,
	textarea {
		width: 100%;
		padding: 0.625rem;
		border: 1px solid rgb(209 213 219);
		border-radius: 8px;
		font-size: 0.875rem;
		background: rgb(255 255 255);
		transition: all 0.2s;
		font-family: 'Montserrat', sans-serif;
		color: rgb(17 24 39);
	}

	:global(.dark) input,
	:global(.dark) textarea {
		background: rgb(55 65 81);
		border-color: rgb(75 85 99);
		color: rgb(243 244 246);
	}

	@media (min-width: 768px) {
		input,
		textarea {
			padding: 0.75rem;
			font-size: 1rem;
		}
	}

	input:focus,
	textarea:focus {
		border-color: #ff6800;
		outline: none;
		box-shadow: 0 0 0 3px rgba(255, 104, 0, 0.1);
	}

	:global(.dark) input:focus,
	:global(.dark) textarea:focus {
		border-color: #ff9500;
		box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.2);
	}

	.signature-area {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgb(209 213 219);
	}

	:global(.dark) .signature-area {
		border-top-color: rgb(75 85 99);
	}

	@media (min-width: 768px) {
		.signature-area {
			margin-top: 3rem;
			padding-top: 2rem;
		}
	}

	.signature-line {
		margin: 1.5rem 0;
		text-align: center;
	}

	@media (min-width: 768px) {
		.signature-line {
			margin: 2rem 0;
		}
	}

	.signature-name {
		border-top: 1px solid rgb(17 24 39);
		padding-top: 0.5rem;
		margin: 0;
		display: inline-block;
		min-width: 250px;
		font-weight: 500;
	}

	:global(.dark) .signature-name {
		border-top-color: rgb(209 213 219);
	}

	@media (min-width: 768px) {
		.signature-name {
			min-width: 300px;
		}
	}

	.signature-title {
		margin: 0.5rem 0 0 0;
		font-size: 0.875rem;
		color: rgb(17 24 39);
		font-weight: 500;
	}

	:global(.dark) .signature-title {
		color: rgb(243 244 246);
	}

	@media (min-width: 768px) {
		.signature-title {
			font-size: 0.9rem;
		}
	}

	.signature-hash {
		margin-top: 1.5rem;
		text-align: center;
		color: rgb(17 24 39);
		font-size: 0.75rem;
		background: rgb(249 250 251);
		padding: 0.875rem;
		border-radius: 8px;
	}

	:global(.dark) .signature-hash {
		background: rgb(55 65 81);
		color: rgb(209 213 219);
	}

	@media (min-width: 768px) {
		.signature-hash {
			margin-top: 2rem;
			font-size: 0.8rem;
			padding: 1rem;
		}
	}

	.location-date {
		text-align: right;
		margin: 1.5rem 0;
		color: rgb(17 24 39);
	}

	:global(.dark) .location-date {
		color: rgb(243 244 246);
	}

	@media (min-width: 768px) {
		.location-date {
			margin: 2rem 0;
		}
	}

	button {
		background: linear-gradient(135deg, #ff6800 0%, #ff9500 100%);
		color: white;
		border: none;
		padding: 0.625rem 1.25rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.9rem;
		margin-top: 0.75rem;
		transition: all 0.2s;
		font-family: 'Montserrat', sans-serif;
		font-weight: 600;
		box-shadow: 0 2px 4px rgba(255, 104, 0, 0.2);
	}

	@media (min-width: 768px) {
		button {
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
			margin-top: 1rem;
		}
	}

	button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(255, 104, 0, 0.3);
	}

	button:active:not(:disabled) {
		transform: translateY(0);
	}

	button:disabled {
		background: rgb(156 163 175);
		cursor: not-allowed;
		box-shadow: none;
	}

	:global(.dark) button:disabled {
		background: rgb(75 85 99);
	}

	.action-button {
		width: 100%;
		padding: 0.875rem;
		font-size: 1rem;
		margin-top: 0.75rem;
	}

	@media (min-width: 768px) {
		.action-button {
			padding: 1rem;
			font-size: 1.1rem;
			margin-top: 1rem;
		}
	}

	.submit-button {
		background: linear-gradient(135deg, #d95518 0%, #ff6800 100%);
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(135deg, #ff6800 0%, #ff9500 100%);
	}

	.contract-actions {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid rgb(209 213 219);
	}

	:global(.dark) .contract-actions {
		border-top-color: rgb(75 85 99);
	}

	@media (min-width: 768px) {
		.contract-actions {
			margin-top: 2rem;
		}
	}

	section {
		margin-bottom: 1.5rem;
	}

	@media (min-width: 768px) {
		section {
			margin-bottom: 2rem;
		}
	}

	h2,
	h3 {
		color: #d95518;
		font-weight: 600;
	}

	:global(.dark) h2,
	:global(.dark) h3 {
		color: #ff6800;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 1.25rem;
	}

	@media (min-width: 768px) {
		h2 {
			font-size: 1.5rem;
			margin-bottom: 1.5rem;
		}
	}

	h3 {
		border-bottom: 2px solid #ff6800;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	@media (min-width: 768px) {
		h3 {
			margin-bottom: 1.5rem;
			font-size: 1.2rem;
		}
	}

	.signature-input {
		margin-top: 1rem;
	}

	.signature-input label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		color: rgb(55 65 81);
	}

	:global(.dark) .signature-input label {
		color: rgb(229 231 235);
	}

	/* Scrollbar customization for sidebar */
	.sidebar::-webkit-scrollbar {
		width: 6px;
	}

	.sidebar::-webkit-scrollbar-track {
		background: rgb(243 244 246);
		border-radius: 8px;
	}

	:global(.dark) .sidebar::-webkit-scrollbar-track {
		background: rgb(55 65 81);
	}

	.sidebar::-webkit-scrollbar-thumb {
		background: rgb(209 213 219);
		border-radius: 8px;
	}

	:global(.dark) .sidebar::-webkit-scrollbar-thumb {
		background: rgb(75 85 99);
	}

	.sidebar::-webkit-scrollbar-thumb:hover {
		background: #ff6800;
	}
</style>

