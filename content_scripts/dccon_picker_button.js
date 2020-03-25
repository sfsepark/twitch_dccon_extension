let DcconPickerButtons = function(dccondata, onClick){

    const FRAME_CLASSNAME = 'dccon-picker-buttons-frame';
    const BUTTON_CLASSNAME = 'dccon-picker-button';

    let createPickerDOM = function(name, image){
    
        let dcconPickerButton = document.createElement('div');
        dcconPickerButton.className = BUTTON_CLASSNAME + ' img tw-tooltip-wrapper tw-inline-block chat-line__message--emote chat-image';
        dcconPickerButton.setAttribute('alt', name) ;
        dcconPickerButton.innerHTML =
            `
                <div class=\"dccon_tooltip tw-tooltip tw-tooltip--up tw-tooltip--align-center\" data-a-target=\"tw-tooltip-label\" style=\"margin-bottom: 0.9rem;\">${name}</div>\
                <a href="#">\
                    <img class="lazy dccon_img" src="${image}" alt="${name}">\
                </a>\
            `;
    
        return dcconPickerButton;
    };

    this.frame = document.createElement('div');
    this.dcconData = dccondata;

    this.dcconData.forEach((v,i) => {
        let name = '~' + v.name[0];
        v.pickerDOM = createPickerDOM(name, v.src);
        this.frame.appendChild(v.pickerDOM);
    },this)

    
    this.frame.className = FRAME_CLASSNAME;
    this.frame.addEventListener('click', (e) => {
        let target = e.target;
        if(!target.classList.containts(FRAME_CLASSNAME)){
            let closestElement = target.closest('.' + BUTTON_CLASSNAME);

            if(closestElement != null && closestElement.alt != undefined){
                onClick(closestElement.alt);
            }
        }
    })


} 

DcconPickerButtons.prototype.search = function(text){
    this.dcconData.forEach(v => {
        if(v.name.includes(text)){
            v.pickerDOM.removeClass('dccon-hide');
        }
        else{
            v.pickerDOM.addClass('dccon-hide');
        }
    })
}