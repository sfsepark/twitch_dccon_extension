// AutoCompleteItem Constructor 정의

const NC_AUTO_COMPLETE_ITEM_CLASSNAME = 'nc-auto-complete-item';
const NC_AUTO_COMPLETE_ITEM_PREFIX = 'nc-auto-complete-item__';

let AutoCompleteItem = (({src,name, index}) => {

    let autocompletItemHTML = `
        <button class="tw-block tw-border-radius-small tw-full-width tw-interactable tw-interactable--alpha tw-interactable--hover-forced tw-interactable--selected tw-interactive" data-a-target="${name}" data-click-index="0">
            <div class="tw-align-items-center tw-flex tw-pd-x-05">
                <div class="tw-flex-shrink-0 tw-pd-05">
                    <img alt="${name}-emote" class="emote-autocomplete-provider__image" srcset="${src}">
                </div>
                <span class="tw-ellipsis" title="${name}">${name}</span>
            </div>
        </button>
        
    `

    this.DOM = document.getElementsByClassName('div');
    this.DOM.className = NC_AUTO_COMPLETE_ITEM_CLASSNAME
    this.DOM.id = NC_AUTO_COMPLETE_ITEM_PREFIX + index;
    this.DOM.innerHTML = autocompletItemHTML;
    this.name = name;
})

AutoCompleteItem.prototype.tunrOn = () => {
    
}

AutoCompleteItem.prototype.tunrOff = () => {
    
}