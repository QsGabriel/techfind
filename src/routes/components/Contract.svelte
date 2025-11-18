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
		gap: 2rem;
		padding: 2rem;
		min-height: calc(100vh - 7rem);
		background-color: #f5f5f5;
	}

	.sidebar {
		width: 300px;
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(24, 23, 23, 0.1);
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.contract-content {
		flex: 1;
		background: white;
		padding: 3rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(24, 23, 23, 0.1);
	}

	.contract-document {
		max-width: 800px;
		margin: 0 auto;
		line-height: 1.6;
		color: #181717;
	}

	.document-header {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem;
		background-color: #d95518;
		color: white;
		border-radius: 8px;
	}

	.logo {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 1rem;
		letter-spacing: 2px;
	}

	.document-header h1 {
		font-size: 1.8rem;
		font-weight: 600;
		margin: 0;
		color: white;
	}

	.document-number {
		margin-top: 0.5rem;
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.party-info {
		background: #f9f9f9;
		padding: 1.5rem;
		border-radius: 4px;
		margin: 1rem 0;
		border-left: 4px solid #ff6800;
	}

	.clause {
		margin-bottom: 2rem;
	}

	.clause h4 {
		color: #d95518;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #181717;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #c4c4c4;
		border-radius: 4px;
		font-size: 1rem;
		background: #fff;
		transition: border-color 0.2s;
		font-family: 'Montserrat', sans-serif;
	}

	input:focus,
	textarea:focus {
		border-color: #ff6800;
		outline: none;
	}

	.signature-area {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #c4c4c4;
	}

	.signature-line {
		margin: 2rem 0;
		text-align: center;
	}

	.signature-name {
		border-top: 1px solid #181717;
		padding-top: 0.5rem;
		margin: 0;
		display: inline-block;
		min-width: 300px;
		font-weight: 500;
	}

	.signature-title {
		margin: 0.5rem 0 0 0;
		font-size: 0.9rem;
		color: #181717;
		font-weight: 500;
	}

	.signature-hash {
		margin-top: 2rem;
		text-align: center;
		color: #181717;
		font-size: 0.8rem;
		background: #f9f9f9;
		padding: 1rem;
		border-radius: 4px;
	}

	.location-date {
		text-align: right;
		margin: 2rem 0;
		color: #181717;
	}

	button {
		background: #ff6800;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		margin-top: 1rem;
		transition: background-color 0.2s;
		font-family: 'Montserrat', sans-serif;
		font-weight: 500;
	}

	button:hover:not(:disabled) {
		background: #ff9500;
	}

	button:disabled {
		background: #c4c4c4;
		cursor: not-allowed;
	}

	.action-button {
		width: 100%;
		padding: 1rem;
		font-size: 1.1rem;
		margin-top: 1rem;
	}

	.submit-button {
		background: #d95518;
	}

	.submit-button:hover:not(:disabled) {
		background: #ff6800;
	}

	.contract-actions {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #c4c4c4;
	}

	section {
		margin-bottom: 2rem;
	}

	h2,
	h3 {
		color: #d95518;
		font-weight: 600;
	}

	h3 {
		border-bottom: 2px solid #ff6800;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
	}
</style>
