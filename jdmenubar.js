class MenuBar {
    constructor(menuBarElement, menuItems) {
        const myself = this;
        this.menuBarElement = menuBarElement;
        this.stateOpen = false;
        this.stateFocus = false;
        menuBarElement.classList.add("jdmenu-bar");
        menuBarElement.onmouseleave = function () {
            myself.stateFocus = false;
        }
        menuBarElement.onmouseenter = function () {
            myself.stateFocus = true;
        }
        document.body.addEventListener("click", function(){
            if (myself.stateOpen && (myself.stateFocus == false)) {
                myself.closeAll(myself);
            }
        });
        document.body.addEventListener("keydown", function(e){
            if ((e.key == "Escape") && myself.stateOpen) {
                myself.closeAll(myself);
            }
        });
        this.parseMenuItems(menuBarElement, menuItems);
    }

    // Recursive function for generating menu item elements and
    // sub menu elements 
    parseMenuItems(menuElement, menuItems) {
        const myself = this;
        for (var i = 0 ; i < menuItems.length ; i++) {
            const menuItem = menuItems[i];
            const menuItemElement = document.createElement("div");
            menuItemElement.classList.add("jdmenu-item");
            menuItemElement.innerText = menuItem["text"];
            menuItemElement.jdmenu_menu = menuElement;
            menuElement.appendChild(menuItemElement);

            if ("subMenuItems" in menuItem) {
                const subMenuElement = document.createElement("div");
                subMenuElement.classList.add("jdmenu-submenu");
                subMenuElement.jdmenu_parentItem = menuItemElement;
                subMenuElement.jdmenu_parentMenu = menuElement;
                menuElement.appendChild(subMenuElement);
                this.parseMenuItems(subMenuElement, menuItem["subMenuItems"], false);
                if (menuElement == this.menuBarElement) {
                    menuItemElement.onclick = function () {
                        myself.toggleSubMenu(myself, subMenuElement);
                    };
                } else {
                    const rightSymbolElement = document.createElement("span");
                    rightSymbolElement.classList.add("jdmenu-right-elem");
                    rightSymbolElement.classList.add("jdmenu-symbol");
                    rightSymbolElement.innerText = "▶";
                    menuItemElement.appendChild(rightSymbolElement);
                }
                menuItemElement.onmouseover = function () {
                    if (myself.stateOpen) {
                        myself.openSubMenu(myself, subMenuElement);
                    }
                };
            } else {
                if (menuElement != this.menuBarElement) {
                    // To close other sub-menues
                    menuItemElement.onmouseover = function () {
                        myself.openSubMenu(myself, menuElement);
                    };
                }
                if ("handler" in menuItem) {
                    menuItemElement.onclick = function () {
                        myself.closeAll(myself);
                        menuItem["handler"]();
                    };                    
                }
                if ("shortcut" in menuItem) {
                    const rightSymbolElement = document.createElement("span");
                    rightSymbolElement.classList.add("jdmenu-right-elem");
                    rightSymbolElement.innerText = menuItem["shortcut"];
                    menuItemElement.appendChild(rightSymbolElement);                
                }

            }
        }
    }

    // myself is this object. Needed since the method is called as a 
    // callback function.
    toggleSubMenu(myself, subMenuElement) {
        const menuItemElement = subMenuElement.jdmenu_parentItem; 
        if (subMenuElement.style.display == "block") {
            this.closeSubMenu(myself, subMenuElement);
        }
        else {
            this.openSubMenu(myself, subMenuElement);
        }
    }

     // myself is this object. Needed since the method is called as a 
    // callback function.
    closeSubMenu(myself, subMenuElement) {
        const menuItemElement = subMenuElement.jdmenu_parentItem; 
        subMenuElement.style.display = "none";
        if (menuItemElement.jdmenu_menu == myself.menuBarElement) {
            // Closed top element. Menu is closed
            myself.stateOpen = false;
        }
    }   

    // myself is this object. Needed since the method is called as a 
    // callback function.
    openSubMenu(myself, subMenuElement) {
        
        // Hide all menus
        this.closeAll(myself);
        myself.stateOpen = true;
        // But display the menu that we just opened and parents
        var menuItem = subMenuElement;
        while(menuItem != myself.menuBarElement) {
            menuItem.style.display = "block";
            menuItem = menuItem.jdmenu_parentMenu;
        }

        const menuItemElement = subMenuElement.jdmenu_parentItem; 
        const pos = menuItemElement.getBoundingClientRect();
        if (subMenuElement.jdmenu_parentMenu == myself.menuBarElement) {
            // Drop down
            subMenuElement.style.left = pos.left;
            subMenuElement.style.top = pos.bottom;
        } else {
            // Show right
            subMenuElement.style.left = pos.right;
            subMenuElement.style.top = pos.top;
        }
    }

    // myself is this object. Needed since the method is called as a 
    // callback function.
    closeAll(myself) {
        const subMenuElements = myself.menuBarElement.getElementsByClassName("jdmenu-submenu");
        for (var element of subMenuElements) {
            element.style.display = "none";
        }
        myself.stateOpen = false;
    }
    
}