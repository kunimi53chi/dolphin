<template>
<div class="ui-textarea" :class="{ focused, filled, tall, pre }">
	<div class="input">
		<span class="label" ref="label"><slot></slot></span>
		<textarea ref="input"
			:value="value"
			:required="required"
			:readonly="readonly"
			:pattern="pattern"
			:autocomplete="autocomplete"
			@input="$emit('input', $event.target.value)"
			@focus="focused = true"
			@blur="focused = false"
		></textarea>
	</div>
	<div class="desc"><slot name="desc"></slot></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		value: {
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		readonly: {
			type: Boolean,
			required: false
		},
		pattern: {
			type: String,
			required: false
		},
		autocomplete: {
			type: String,
			required: false
		},
		tall: {
			type: Boolean,
			required: false,
			default: false
		},
		pre: {
			type: Boolean,
			required: false,
			default: false
		},
	},
	data() {
		return {
			focused: false,
			passwordStrength: ''
		}
	},
	computed: {
		filled(): boolean {
			return this.value != '' && this.value != null;
		}
	},
	methods: {
		focus() {
			this.$refs.input.focus();
		}
	}
});
</script>

<style lang="scss" scoped>
@import '../../theme';

.ui-textarea {
	margin: 42px 0 32px 0;
	position: relative;

	&:last-child {
		margin-bottom: 0;
	}

	> .input {
		padding: 12px;
		position: relative;
	
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: none;
			border: solid 1px #dae0e4;
			border-radius: 3px;
			pointer-events: none;
		}

		&:after {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: none;
			border: solid 2px $primary;
			border-radius: 3px;
			opacity: 0;
			transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			pointer-events: none;
		}

		> .label {
			position: absolute;
			top: 6px;
			left: 12px;
			pointer-events: none;
			transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
			transition-duration: 0.3s;
			font-size: 16px;
			line-height: 32px;
			pointer-events: none;
			//will-change transform
			transform-origin: top left;
			transform: scale(1);
		}

		> textarea {
			display: block;
			width: 100%;
			min-width: 100%;
			max-width: 100%;
			min-height: 100px;
			padding: 0;
			font: inherit;
			font-weight: normal;
			font-size: 16px;
			background: transparent;
			border: none;
			border-radius: 0;
			outline: none;
			box-shadow: none;
		}
	}

	> .desc {
		margin: 6px 0;
		font-size: 13px;
		opacity: 0.7;

		&:empty {
			display: none;
		}

		* {
			margin: 0;
		}
	}

	&.focused {
		> .input {
			&:after {
				opacity: 1;
			}

			> .label {
				color: $primary;
			}
		}
	}

	&.focused,
	&.filled {
		> .input {
			> .label {
				top: -24px;
				left: 0 !important;
				transform: scale(0.75);
			}
		}
	}

	&.tall {
		> .input {
			> textarea {
				min-height: 200px;
			}
		}
	}

	&.pre {
		> .input {
			> textarea {
				white-space: pre;
			}
		}
	}
}
</style>
