class MenuBar {
    constructor(menuBarElement, menuItems) {
        this.menuBarElement = menuBarElement;
        menuBarElement.classList.add("jdmenu-bar");
        this.parseMenuItems(menuBarElement, menuItems, true);
    }

    // Recursive function for generating menu item elements and
    // sub menu elements 
    parseMenuItems(menuElement, menuItems, topLevel) {
        for (var i = 0 ; i < menuItems.length ; i++) {
            const menuItem = menuItems[i];
            const menuItemElement = document.createElement("div");
            menuItemElement.classList.add("jdmenu-item");
            menuItemElement.innerText = menuItem["text"];
            menuItemElement.setAttribute("jdmenu_menu", menuElement);
            menuElement.appendChild(menuItemElement);
            menuItem["_menuElement"] = menuElement; 
            menuItem["_itemElement"] = menuItemElement;

            if ("subMenuItems" in menuItem) {
                const subMenuElement = document.createElement("div");
                subMenuElement.classList.add("jdmenu-submenu");
                menuElement.appendChild(subMenuElement);
                menuItem["_subMenuElement"] = subMenuElement;
                this.parseMenuItems(subMenuElement, menuItem["subMenuItems"], false);
                const myself = this;
                menuItemElement.onclick = function () {
                    myself.toggleSubMenu(myself, menuItem, topLevel);
                };
            }
        }
    }

    // dropDown is sub menu shall appear down or to the right 
    toggleSubMenu(myself, menuItem, dropDown) {
        const menuItemElement = menuItem["_itemElement"];
        const subMenuElement = menuItem["_subMenuElement"];
        if (subMenuElement.style.display == "block") {
            subMenuElement.style.display = "none";
        }
        else {
            // Hide all menus
            const subMenuElements = myself.menuBarElement.getElementsByClassName("jdmenu-submenu");
            for (var element of subMenuElements) {
                element.style.display = "none";
            }
            // But display the menu that we just opened and parents
            subMenuElement.style.display = "block";

            const pos = menuItemElement.getBoundingClientRect();
            if (dropDown) {
                subMenuElement.style.left = pos.left;
                subMenuElement.style.top = pos.bottom;
            } else {
                subMenuElement.style.left = pos.right;
                subMenuElement.style.top = pos.top;
            }
        }
    }

    
}