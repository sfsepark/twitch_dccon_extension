let DcconPickerButtons = function(dccondata, onClick, tooltip){

    const FRAME_CLASSNAME = 'dccon-picker-buttons-frame';
    const BUTTON_CLASSNAME = 'dccon-picker-button';

    let createPickerDOM = function(name, image){
    
        let dcconPickerButton = document.createElement('div');
        dcconPickerButton.className = BUTTON_CLASSNAME + ' img tw-tooltip-wrapper tw-inline-block chat-line__message--emote chat-image';
        dcconPickerButton.setAttribute('alt', name) ;

        let dcconPickerButtonHTML = '';

        if(tooltip !== false){
            dcconPickerButtonHTML += 
                `<div class=\"dccon_tooltip tw-tooltip tw-tooltip--up tw-tooltip--align-center\" data-a-target=\"tw-tooltip-label\" style=\"margin-bottom: 0.9rem;\">${name}</div>`
        }
        dcconPickerButtonHTML +=
            `
                <a href="#">\
                    <img class="lazy dccon_img" src="${image}" alt="${name}">\
                </a>\
            `;
            
        dcconPickerButton.innerHTML = dcconPickerButtonHTML;

        return dcconPickerButton;
    };

    this.frame = document.createElement('div');
    this.dcconData = dccondata.dccon;

    this.dcconData.forEach((v,i) => {
        let name = '~' + v.name[0];
        v.pickerDOM = createPickerDOM(name, v.src);
        this.frame.appendChild(v.pickerDOM);
    },this)

    
    this.frame.className = FRAME_CLASSNAME;
    this.frame.addEventListener('click', (e) => {
        let target = e.target;
        if(!target.classList.contains(FRAME_CLASSNAME)){
            let closestElement = target.closest('.' + BUTTON_CLASSNAME);

            if(closestElement != null && closestElement.getAttribute('alt') != undefined){
                onClick(closestElement.getAttribute('alt'));
            }
        }
    })


} 

DcconPickerButtons.prototype.search = function(text){
    if(text == ''){
        this.dcconData.forEach(v => {
            v.pickerDOM.classList.remove('dccon-hide');
        })
    }
    else{
        this.dcconData.forEach(v => {
            let finded = false;

            v.name.forEach(name => {
                if(name.search(text) != -1){
                    finded = true;
                }
            })

            if(finded){
                v.pickerDOM.classList.remove('dccon-hide');
            }
            else{
                v.pickerDOM.classList.add('dccon-hide');
            }
        })
    }

}