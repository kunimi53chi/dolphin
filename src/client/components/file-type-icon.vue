<template>
<span class="dp-file-type-icon">
	<template v-if="kind == 'image'"><fa icon="file-image"/></template>
</span>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	props: ['type'],
	computed: {
		kind(): string {
			return this.type.split('/')[0];
		}
	}
});
</script>
