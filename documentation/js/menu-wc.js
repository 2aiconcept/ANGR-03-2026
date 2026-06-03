'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">mini-crm documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/FormCompany.html" data-type="entity-link" >FormCompany</a>
                            </li>
                            <li class="link">
                                <a href="components/FormConnect.html" data-type="entity-link" >FormConnect</a>
                            </li>
                            <li class="link">
                                <a href="components/FormContact.html" data-type="entity-link" >FormContact</a>
                            </li>
                            <li class="link">
                                <a href="components/FormOrder.html" data-type="entity-link" >FormOrder</a>
                            </li>
                            <li class="link">
                                <a href="components/Header.html" data-type="entity-link" >Header</a>
                            </li>
                            <li class="link">
                                <a href="components/Nav.html" data-type="entity-link" >Nav</a>
                            </li>
                            <li class="link">
                                <a href="components/PageAddCompany.html" data-type="entity-link" >PageAddCompany</a>
                            </li>
                            <li class="link">
                                <a href="components/PageAddContact.html" data-type="entity-link" >PageAddContact</a>
                            </li>
                            <li class="link">
                                <a href="components/PageAddOrder.html" data-type="entity-link" >PageAddOrder</a>
                            </li>
                            <li class="link">
                                <a href="components/PageConnect.html" data-type="entity-link" >PageConnect</a>
                            </li>
                            <li class="link">
                                <a href="components/PageEditCompany.html" data-type="entity-link" >PageEditCompany</a>
                            </li>
                            <li class="link">
                                <a href="components/PageEditContact.html" data-type="entity-link" >PageEditContact</a>
                            </li>
                            <li class="link">
                                <a href="components/PageEditOrder.html" data-type="entity-link" >PageEditOrder</a>
                            </li>
                            <li class="link">
                                <a href="components/PageListCompanies.html" data-type="entity-link" >PageListCompanies</a>
                            </li>
                            <li class="link">
                                <a href="components/PageListContacts.html" data-type="entity-link" >PageListContacts</a>
                            </li>
                            <li class="link">
                                <a href="components/PageListOrders.html" data-type="entity-link" >PageListOrders</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});