<style>
    .loader {
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.5);
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
		-webkit-animation: pulsate 1.5s ease infinite both;
				animation: pulsate 1.5s ease infinite both;
	}
	@keyframes pulsate {
		0% {
		-webkit-transform: scale(0.5);
				transform: scale(0.5);
		}
		50% {
		-webkit-transform: scale(1);
				transform: scale(1);
		}
		100% {
		-webkit-transform: scale(0.5);
				transform: scale(0.5);
		}
    }
</style>

<div class="loader"></div>
