const visualizer = document.querySelector('.visualizer')
const audio = document.querySelector('audio')

audio.addEventListener('play', () => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(audio);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barNumber = Math.floor(visualizer.clientWidth / 30)
    const barLength = 60

    source.connect(analyser);
    analyser.connect(context.destination);

    for(let i = 0; i < barNumber; i++) {
        const bar = document.createElement('ul')
        bar.className = 'bar'
        for (let j = 0; j < barLength; j++) {
            const item = document.createElement('li')
            item.style.backgroundColor = `#222`
            bar.appendChild(item)
        }
        visualizer.appendChild(bar)
    }

    function light(number, bar) {
        number = number < barLength - 1 ? number : barLength - 1
        const children = bar.children
        const step = Math.floor(255 / barLength)
        for (let i = 0; i < children.length; i++) {
            children[i].style.backgroundColor = '#222'
        }
        for (let i = barLength - 1; i >= barLength - 1 - number; i--) {
            children[i].style.backgroundColor = `rgb(${255 - i * step}, ${i * step}, 255)`
        }
    }

    function update() {
        analyser.getByteFrequencyData(dataArray);
        for(let i = 0; i < barNumber; i++) {
            light(Math.floor(dataArray[i * 2] / 5), visualizer.children[i])
        }
        this.animation = requestAnimationFrame(update)
    }
    
    update()
})

audio.addEventListener('pause', () => {
    cancelAnimationFrame(this.animation)
})

audio.addEventListener('ended', () => {
    cancelAnimationFrame(this.animation)
})