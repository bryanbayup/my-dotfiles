class SnippingTool{
    listener;
    snippingMode = false;
    confirming = false;
    language = 'eng';

    onSnip(listener){
        this.listener = listener;
    }

    notifyListener(imageUrl){
        this.listener?.(imageUrl, this.language);
    }

    register(){
        document.addEventListener('keydown', event => {
            if(event.ctrlKey && event.key === 's'){
                event.preventDefault();
            
                this.enableSnippingMode();
            }else if(event.key === 'Escape' && this.snippingMode){
                this.disableSnippingMode();
            }
        });
    }

    enableSnippingMode(){
        if(this.snippingMode){
            return;
        }

        this.snippingMode = true;

        const { wrapperElem, containerElem } = this.addElements();
    
        let startX, startY, endX, endY;
    
        const updateStyles = function(){
            const leftSideX = Math.min(startX, endX);
            const topSideY = Math.min(startY, endY);
            const rightSideX = Math.max(startX, endX);
            const bottomSideY = Math.max(startY, endY);
    
            containerElem.style.clipPath = `path('M 0 0 \
                L ${containerElem.offsetWidth} 0 \
                L ${containerElem.offsetWidth} ${containerElem.offsetHeight} \
                L 0 ${containerElem.offsetHeight} \
                L 0 0 \
                L ${leftSideX} ${topSideY} \
                L ${leftSideX} ${bottomSideY} \
                L ${rightSideX} ${bottomSideY} \
                L ${rightSideX} ${topSideY} \
                L ${leftSideX} ${topSideY}')`;
        };
    
        let dragging = false;
    
        wrapperElem.addEventListener('mousedown', event => {
            if(this.confirming){
                return;
            }

            dragging = true;
    
            startX = endX = event.clientX;
            startY = endY = event.clientY;
    
            updateStyles();
        });
    
        wrapperElem.addEventListener('mousemove', event => {
            if(this.confirming){
                return;
            }

            if(!dragging){
                return;
            }
    
            endX = event.clientX;
            endY = event.clientY;
    
            updateStyles();
        });
    
        wrapperElem.addEventListener('mouseup', async event => {
            if(this.confirming){
                return;
            }
            
            dragging = false;

            endX = event.clientX;
            endY = event.clientY;
    
            updateStyles();

            const confirmed = await this.confirmation(startX, startY, endX, endY);
    
            if(!confirmed){
                startX = startY = endX = endY = 0;

                updateStyles();

                return;
            }

            this.removeElements();

            this.snippingMode = false;

            await wait(500);

            const scale = window.devicePixelRatio;

            this.snip(
                Math.min(startX, endX) * scale,
                Math.min(startY, endY) * scale,
                Math.abs(startX - endX) * scale,
                Math.abs(startY - endY) * scale
            );
        });
    }

    confirmation(startX, startY, endX, endY){
        this.confirming = true;

        const wrapperElem = document.querySelector('.snipping_wrapper');

        const confirmationElem = document.querySelector('.snipping_confirmation');

        confirmationElem.style.right = `${wrapperElem.offsetWidth - endX}px`;
        if(endY + confirmationElem.offsetHeight < wrapperElem.offsetHeight){
            confirmationElem.style.top = `${endY}px`;
        }else{
            confirmationElem.style.top = 'auto';
            confirmationElem.style.bottom = `${wrapperElem.offsetHeight - startY}px`;
        }

        const confirmationLanguageElem = confirmationElem.querySelector('.snipping_confirmation_language');
        const confirmationYesElem = confirmationElem.querySelector('.snipping_confirmation_yes');
        const confirmationNoElem = confirmationElem.querySelector('.snipping_confirmation_no');

        return new Promise(resolve => {
            const onAnswer = event => {
                event.stopPropagation();

                confirmationYesElem.removeEventListener('click', onConfirm);
                confirmationNoElem.removeEventListener('click', onCancel);

                confirmationElem.style.right = '200%';
                confirmationElem.style.top = 0;
                confirmationElem.style.bottom = 'auto';
                this.confirming = false;
            }

            const onConfirm = event => {
                onAnswer(event);

                this.language = confirmationLanguageElem.querySelector('select').value;

                resolve(true);
            };

            confirmationYesElem.addEventListener('click', onConfirm);

            const onCancel = event => {
                onAnswer(event);

                resolve(false);
            };

            confirmationNoElem.addEventListener('click', onCancel);
        });
    }

    disableSnippingMode(){
        this.removeElements();
        this.snippingMode = false;
        this.confirming = false;
    }

    addElements(){
        const wrapperElem = document.createElement('div');
        wrapperElem.classList.add('snipping_wrapper');
    
        const containerElem = document.createElement('div');
        containerElem.classList.add('snipping_container');

        containerElem.innerHTML = `
            <div class="snipping_confirmation">
                <div class="snipping_confirmation_language">
                    <select>
                        <option value="eng">English</option>
                        <option value="spa">Spanish</option>
                        <option value="chi_sim">Chinese - Simplified</option>
                        <option value="chi_tra">Chinese - Traditional</option>
                        <option value="ben">Bengali</option>
                        <option value="hin">Hindi</option>
                        <option value="jpn">Japanese</option>
                        <option value="por">Portuguese</option>
                        <option value="rus">Russian</option>
                        <option value="vie">Vietnamese</option>
                    </select>
                </div>

                <div class="snipping_confirmation_yes" title="Confirm">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M9 16.2L4.8 12l-1.4 1.4 5.6 5.6L21.4 7.3l-1.4-1.4L9 16.2z" fill="green"/>
                    </svg>
                </div>

                <div class="snipping_confirmation_no" title="Cancel">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                            fill="red"
                        />
                    </svg>
                </div>
            </div>
        `;
    
        wrapperElem.appendChild(containerElem);
        
        document.body.appendChild(wrapperElem);

        $('.snipping_confirmation_language select').select2({
            selectionCssClass: 'snipping_confirmation_language_selection',
            dropdownCssClass: 'snipping_confirmation_language_dropdown'
        });

        return { wrapperElem, containerElem };
    }

    removeElements(){
        document.querySelector('.snipping_wrapper')?.remove();
    }

    snip(x, y, width, height){
        const listener = request => {
            if(!request.action === 'snipping_result'){
                return;
            }

            chrome.runtime.onMessage.removeListener(listener);

            this.notifyListener(request.imageUrl);
        };

        chrome.runtime.onMessage.addListener(listener);

        chrome.runtime.sendMessage({
            action: 'snip',
            x,
            y,
            width,
            height
        });
    }
}