<template>
<button class="wfliddvnhxvyusikowhxozkyxyenqxqr"
	:class="{ wait, active: isFollowing || hasPendingFollowRequestFromYou }"
	@click="onClick"
	:disabled="wait"
>
	<template v-if="!wait">
		<fa v-if="hasPendingFollowRequestFromYou && user.isLocked" :icon="faHourglassHalf"/>
		<fa v-else-if="hasPendingFollowRequestFromYou && !user.isLocked" :icon="faSpinner" pulse/>
		<fa v-else-if="isFollowing" :icon="faMinus"/>
		<fa v-else-if="!isFollowing && user.isLocked" :icon="faPlus"/>
		<fa v-else-if="!isFollowing && !user.isLocked" :icon="faPlus"/>
	</template>
	<template v-else><fa :icon="faSpinner" pulse fixed-width/></template>
</button>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../i18n';
import { faSpinner, faPlus, faMinus, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

export default Vue.extend({
	i18n,

	props: {
		user: {
			type: Object,
			required: true
		},
	},

	data() {
		return {
			isFollowing: this.user.isFollowing,
			hasPendingFollowRequestFromYou: this.user.hasPendingFollowRequestFromYou,
			wait: false,
			connection: null,
			faSpinner, faPlus, faMinus, faHourglassHalf
		};
	},

	mounted() {
		this.connection = this.$root.stream.useSharedConnection('main');

		this.connection.on('follow', this.onFollowChange);
		this.connection.on('unfollow', this.onFollowChange);
	},

	beforeDestroy() {
		this.connection.dispose();
	},

	methods: {
		onFollowChange(user) {
			if (user.id == this.user.id) {
				this.isFollowing = user.isFollowing;
				this.hasPendingFollowRequestFromYou = user.hasPendingFollowRequestFromYou;
			}
		},

		async onClick() {
			this.wait = true;

			try {
				if (this.isFollowing) {
					const { canceled } = await this.$root.dialog({
						type: 'warning',
						text: this.$t('@.unfollow-confirm', { name: this.user.name || this.user.username }),
						showCancelButton: true
					});

					if (canceled) return;

					await this.$root.api('following/delete', {
						userId: this.user.id
					});
				} else {
					if (this.hasPendingFollowRequestFromYou) {
						await this.$root.api('following/requests/cancel', {
							userId: this.user.id
						});
					} else if (this.user.isLocked) {
						await this.$root.api('following/create', {
							userId: this.user.id
						});
						this.hasPendingFollowRequestFromYou = true;
					} else {
						await this.$root.api('following/create', {
							userId: this.user.id
						});
						this.hasPendingFollowRequestFromYou = true;
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				this.wait = false;
			}
		}
	}
});
</script>

<style lang="scss" scoped>
@import '../theme';

.wfliddvnhxvyusikowhxozkyxyenqxqr {
	position: relative;
	display: inline-block;
	user-select: none;
	cursor: pointer;
	font-weight: bold;
	color: $primary;
	background: transparent;
	outline: none;
	border: solid 1px $primary;
	padding: 0;
	width: 31px;
	height: 31px;
	font-size: 16px;
	border-radius: 100%;
	background: #fff;

	&:focus {
		&:after {
			content: "";
			pointer-events: none;
			position: absolute;
			top: -5px;
			right: -5px;
			bottom: -5px;
			left: -5px;
			border: 2px solid rgba($primary, 0.3);
			border-radius: 100%;
		}
	}

	&:hover {
		background: mix($primary, #fff, 20);
	}

	&:active {
		background: mix($primary, #fff, 40);
	}

	&.active {
		color: #fff;
		background: $primary;

		&:hover {
			background: lighten($primary, 10%);
			border-color: lighten($primary, 10%);
		}

		&:active {
			background: darken($primary, 10%);
			border-color: darken($primary, 10%);
		}
	}

	&.wait {
		cursor: wait !important;
		opacity: 0.7;
	}

	* {
		pointer-events: none;
	}
}
</style>
