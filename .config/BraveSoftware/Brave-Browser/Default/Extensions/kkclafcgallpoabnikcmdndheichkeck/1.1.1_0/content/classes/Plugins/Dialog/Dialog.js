class Dialog{
    static dialogWrapperElem;

    static async show(title, text, buttons = []){
        Dialog.dialogWrapperElem = document.createElement('div');

        Dialog.dialogWrapperElem.classList.add('custom_dialog_wrapper');

        Dialog.dialogWrapperElem.innerHTML = `
            <div class="custom_dialog_container">
                <svg class="custom_dialog_close" width="32" height="32" viewBox="0 0 24 24">
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        fill="white"
                    />
                </svg>

                <div class="custom_dialog">
                    <div class="custom_dialog_header">${title}</div>

                    <div class="custom_dialog_content">${text}</div>

                    <div class="custom_dialog_actions"></div>
                </div>
            </div>
        `;

        buttons.forEach(button => {
            const buttonElem = document.createElement('div');

            buttonElem.classList.add('custom_dialog_button');
            buttonElem.onclick = button.onClick;
            
            buttonElem.innerHTML = button.text;

            Dialog.dialogWrapperElem.querySelector('.custom_dialog_actions').appendChild(buttonElem);
        });

        Dialog.dialogWrapperElem.querySelector('.custom_dialog_close').addEventListener('click', Dialog.hide);

        document.body.appendChild(Dialog.dialogWrapperElem);
    }

    static hide(){
        Dialog.dialogWrapperElem.remove();
        Dialog.dialogWrapperElem = null;
    }
}