<template>
<div class="dp-home">
	<x-home-timeline/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import XHomeTimeline from './index.home.timeline.vue';

export default Vue.extend({
	components: {
		XHomeTimeline
	}
});
</script>
