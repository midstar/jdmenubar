class MenuBar {
    constructor(menuBarElement, menuItems) {
        this.menuBarElement = menuBarElement;
        menuBarElement.classList.add("jdmenu-bar");
        this.parseMenuItems(menuBarElement, menuItems);
    }

    // Recursive function for generating menu item elements and
    // sub menu elements 
    parseMenuItems(menuElement, menuItems) {
        for (var i = 0 ; i < menuItems.length ; i++) {
            const menuItem = menuItems[i];
            const menuItemElement = document.createElement("div");
            menuItemElement.classList.add("jdmenu-item");
            menuItemElement.innerText = menuItem["text"];
            menuElement.appendChild(menuItemElement);

            if ("subMenuItems" in menuItem) {
                const subMenuElement = document.createElement("div");
                subMenuElement.classList.add("jdmenu-submenu");
                subMenuElement.jdmenu_parentItem = menuItemElement;
                subMenuElement.jdmenu_parentMenu = menuElement;
                menuElement.appendChild(subMenuElement);
                this.parseMenuItems(subMenuElement, menuItem["subMenuItems"], false);
                const myself = this;
                menuItemElement.onclick = function () {
                    myself.toggleSubMenu(myself, subMenuElement);
                };
            }
        }
    }

    // myself is this object. Needed since the method is called as a 
    // callback function.
    toggleSubMenu(myself, subMenuElement) {
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
            var menuItem = subMenuElement;
            while(menuItem != myself.menuBarElement) {
                menuItem.style.display = "block";
                menuItem = menuItem.jdmenu_parentMenu;
            }

            const menuItemElement = subMenuElement.jdmenu_parentItem; 
            const pos = menuItemElement.getBoundingClientRect();
            console.log(pos);
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
    }

    
}