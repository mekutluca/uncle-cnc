<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { createFormEnhance } from '$lib/utils/form-enhance';

	let {
		open = $bindable(false),
		machine,
		action = '?/deleteMachine'
	}: {
		open?: boolean;
		machine: { id: string; title: string } | null;
		action?: string;
	} = $props();

	let loading = $state(false);

	const deleteEnhance = createFormEnhance({
		loadingMessage: 'Siliniyor…',
		onStart: () => (loading = true),
		onFinish: () => (loading = false),
		onSuccess: () => (open = false)
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Makineyi sil</AlertDialog.Title>
			<AlertDialog.Description>
				"{machine?.title}" ilanı ve tüm fotoğrafları kalıcı olarak silinecek. Bu işlem geri
				alınamaz.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" {action} use:enhance={deleteEnhance}>
			<input type="hidden" name="id" value={machine?.id ?? ''} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button" disabled={loading}>Vazgeç</AlertDialog.Cancel>
				<Button type="submit" variant="destructive" disabled={loading}>Kalıcı Olarak Sil</Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
