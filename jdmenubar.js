class MenuBar {
    constructor(menuBarElement, menuItems) {
        this.menuItems = menuItems;
        menuBarElement.classList.add("jdmenu-bar");

        const callbackToggleSubMenu = this.toggleSubMenu;

        menuItems.forEach(function(menuItem) {
            const menuItemElement = document.createElement("div");
            menuItemElement.classList.add("jdmenu-item");
            menuItemElement.innerText = menuItem["text"];
            menuBarElement.appendChild(menuItemElement);
            menuItem["_menuElement"] = menuBarElement; 
            menuItem["_itemElement"] = menuItemElement;

            if ("subMenuItems" in menuItem) {
                const subMenuElement = document.createElement("div");
                subMenuElement.classList.add("jdmenu-submenu");
                menuItem["subMenuItems"].forEach(function(subMenuItem) {
                    const subMenuItemElement = document.createElement("div");
                    subMenuItemElement.classList.add("jdmenu-item");
                    subMenuItemElement.innerText = subMenuItem["text"];
                    subMenuElement.appendChild(subMenuItemElement);
                    subMenuItem["_menuElement"]=subMenuElement;
                    subMenuItem["_itemElement"];
                    subMenuItem["_parent"] = menuItem;
                });
                menuBarElement.appendChild(subMenuElement);
                menuItem["_subMenuElement"] = subMenuElement;
                menuItemElement.onclick = function () {
                    callbackToggleSubMenu(menuItem);
                };
            }
        });
    }

    // Recursive
    parseMenuItems(menuElement, menuItems) {

    }

    toggleSubMenu(menuItem) {
        const menuItemElement = menuItem["_itemElement"];
        const subMenuElement = menuItem["_subMenuElement"];
        if (subMenuElement.style.display == "block") {
            subMenuElement.style.display = "none";
        }
        else {
            // Put sub menu in the bottom left position of menu menuBarElement
            const pos = menuItemElement.getBoundingClientRect();
            subMenuElement.style.left = pos.left;
            subMenuElement.style.top = pos.bottom;
            subMenuElement.style.display = "block";
        }
    }

    
}