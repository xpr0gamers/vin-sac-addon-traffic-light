(function(){"use strict";const o=document.createElement("template");o.innerHTML=`
        <style>
            .plotarea-overlay-container {
                width: 100%;
                height: 100%;
                position: relative;
                background-color: grey;
            }
        </style>
        <div class="plotarea-overlay-container"/>
    `;const a=document.createElement("template");a.innerHTML=`
        <style>
            .traffic-light-container {
                width: 100%;
                height: 100%;
                position: relative;
            }
            .traffic-light {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #e53935;
                box-shadow: inset 0 0 8px rgba(0,0,0,.35);
            }
        </style>
        <div class="traffic-light-container">
            <div class="traffic-light" ></div>
        </div>
    `;class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}).appendChild(o.content.cloneNode(!0))}setExtensionData(e){this.extensionData=e,this.render()}onBeforeUpdate(e){}onAfterUpdate(e){}render(){debugger;for(const e of this.extensionData.series)for(const r of e.dataPoints){const{labelInfo:n}=r,t=a.content.cloneNode(!0);t.style.position="absolute",t.style.left=`${n.x}px`,t.style.top=`${n.y}px`,this.shadowRoot.querySelector(".plotarea-overlay-container").appendChild(t)}}}customElements.define("viz-plotarea-general",i)})();
