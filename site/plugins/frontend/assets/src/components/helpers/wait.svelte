<style>
    .loader {
		width: 100%;
		height: 100%;
		background-color: #000;
		/* z-index: 30; */
		position: absolute;
		top: 0;
		left: 0;
	}
	.loader:after {
		content: "";
		position: absolute;
		display: block;
		height: 2rem;
		width: 2rem;
		top: 50%;
		left: 50%;
		margin-left: -1rem;
		margin-top: -1rem;
		border-radius: 5rem;
		z-index: 1;
		background-color: #fff;
		-webkit-animation: pulsate 2s ease infinite both;
				animation: pulsate 2s ease infinite both;
	}
	@keyframes pulsate {
		0% {
		-webkit-transform: scale(0.8);
				transform: scale(0.8);
		}
		50% {
		-webkit-transform: scale(1.6);
				transform: scale(1.6);
		}
		100% {
		-webkit-transform: scale(0.8);
				transform: scale(0.8);
		}
    }
</style>

<div class="loader"></div>
