// AutoCompleteItem Constructor 정의

const NC_AUTO_COMPLETE_ITEM_CLASSNAME = 'nc-auto-complete-item';
const NC_AUTO_COMPLETE_ITEM_PREFIX = 'nc-auto-complete-item__';

const NC_ITEM_FOCUSED_OFF = 'tw-block tw-border-radius-small tw-full-width tw-interactable tw-interactable--alpha tw-interactive';
const NC_ITEM_FOCUSED_ON = 'tw-block tw-border-radius-small tw-full-width tw-interactable tw-interactable--alpha tw-interactable--hover-forced tw-interactable--selected tw-interactive'

function AutoCompleteItem({src,name, index}){

    let autocompletItemHTML = `
        <button class="${NC_ITEM_FOCUSED_OFF}" data-a-target="${name[0]}" data-click-index="0">
            <div class="tw-align-items-center tw-flex tw-pd-x-05">
                <div class="tw-flex-shrink-0 tw-pd-05">
                    <img alt="${name[0]}-emote" class="emote-autocomplete-provider__image" srcset="${src}">
                </div>
                <span class="tw-ellipsis" title="${name[0]}">${name[0]}</span>
            </div>
        </button>
        
    `

    this.DOM = document.createElement('div');
    this.DOM.className = NC_AUTO_COMPLETE_ITEM_CLASSNAME
    this.DOM.id = NC_AUTO_COMPLETE_ITEM_PREFIX + index;
    this.DOM.innerHTML = autocompletItemHTML;
    this.buttonDOM = this.DOM.firstElementChild;
    this.name = name[0];
}

AutoCompleteItem.prototype.turnOn = function(){
    this.buttonDOM.className = NC_ITEM_FOCUSED_ON;
}

AutoCompleteItem.prototype.turnOff = function(){
    this.buttonDOM.className = NC_ITEM_FOCUSED_OFF;
}