<template>
<div class="dp-sub-note-content">
	<div class="body">
		<span v-if="note.isHidden" style="opacity: 0.5">({{ $t('private') }})</span>
		<span v-if="note.deletedAt" style="opacity: 0.5">({{ $t('deleted') }})</span>
		<a class="reply" v-if="note.replyId"><fa icon="reply"/></a>
		<mfm v-if="note.text" :text="note.text" :author="note.user" :i="$store.state.i" :custom-emojis="note.emojis"/>
		<a class="rp" v-if="note.renoteId">RN: ...</a>
	</div>
	<details v-if="note.files.length > 0">
		<summary>({{ $t('media-count').replace('{}', note.files.length) }})</summary>
		<dp-media-list :media-list="note.files"/>
	</details>
	<details v-if="note.poll">
		<summary>{{ $t('poll') }}</summary>
		<dp-poll :note="note"/>
	</details>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../i18n';
export default Vue.extend({
	i18n,
	props: ['note']
});
</script>

<style lang="scss" scoped>
.dp-sub-note-content {
	overflow-wrap: break-word;

	> .body {
		> .reply {
			margin-right: 6px;
			color: #717171;
		}

		> .rp {
			margin-left: 4px;
			font-style: oblique;
			color: var(--renoteText);
		}
	}

	dp-poll {
		font-size: 80%;
	}
}
</style>
