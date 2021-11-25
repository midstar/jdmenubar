/**
 * @file jdmenubar javascript library.
 * @copyright Joel Midstjärna 2021
 */

class MenuBar {

  constructor(menuBarElement, menuItems) {
    this.menuBarElement = menuBarElement;
    this.menuItems = menuItems;
    this.stateOpen = false;
    this.stateFocus = false;
    const myself = this;
    menuBarElement.classList.add("jdmenu-bar");
    menuBarElement.onmouseleave = function () {
      myself.stateFocus = false;
    }
    menuBarElement.onmouseenter = function () {
      myself.stateFocus = true;
    }
    document.addEventListener("click", function(){
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
    const isTopMenuItem = (menuElement == this.menuBarElement);
    for (var i = 0 ; i < menuItems.length ; i++) {
      const menuItem = menuItems[i];
      if (("text" in menuItem) == false) {
        if (("separator" in menuItem) && menuItem["separator"] == true) {
          menuElement.appendChild(document.createElement("hr"));
        }
        continue;
      }
      const menuItemElement = document.createElement("div");
      menuItemElement.classList.add("jdmenu-item");
      menuItemElement.jdmenu_menu = menuElement;
      menuElement.appendChild(menuItemElement);

      if (isTopMenuItem == false) {
        const leftElement = document.createElement("span");
        const middleElement = document.createElement("span");
        const rightElement = document.createElement("span");

        menuItemElement.appendChild(leftElement);
        menuItemElement.appendChild(middleElement);
        menuItemElement.appendChild(rightElement);

        if ("icon" in menuItem) {
          leftElement.innerHTML = menuItem["icon"]; 
        }
        middleElement.innerHTML = menuItem["text"];
        if ("subMenuItems" in menuItem) {
          rightElement.classList.add("jdmenu-submenu-symbol");
          rightElement.innerText = "▶";
        } else if ("shortcut" in menuItem) {
          rightElement.innerHTML = menuItem["shortcut"];                
        }
      } else {
        menuItemElement.innerHTML = menuItem["text"];
      }

      if (("enabled" in menuItem) && (menuItem["enabled"] == false)) {
        menuItemElement.classList.add("jdmenu-item-disabled");
        continue;
      }


      if ("subMenuItems" in menuItem) {
        const subMenuElement = document.createElement("div");
        subMenuElement.classList.add("jdmenu-submenu");
        subMenuElement.jdmenu_parentItem = menuItemElement;
        subMenuElement.jdmenu_parentMenu = menuElement;
        menuElement.appendChild(subMenuElement);
        this.parseMenuItems(subMenuElement, menuItem["subMenuItems"], false);
        if (isTopMenuItem) {
          menuItemElement.onclick = function () {
              myself.toggleSubMenu(myself, subMenuElement);
          };
        }
        menuItemElement.onmouseover = function () {
          if (myself.stateOpen) {
            myself.openSubMenu(myself, subMenuElement);
          }
        };
      } else if (isTopMenuItem == false) {
        // To close other sub-menues
        menuItemElement.onmouseover = function () {
          myself.openSubMenu(myself, menuElement);
        };

        if ("handler" in menuItem) {
          menuItemElement.onclick = function () {
            myself.closeAll(myself);
            menuItem["handler"]();
          };                    
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

  // Get item with id (value if id property). Useful when updating items
  // in the menu. Call the update() method afterwards to make the change
  // have effect.
  // Returns null if no such element exists.
  getItemWithId(id) {
    return this.getItemWithIdOf(id, this.menuItems);
  }

  // Recursive function to traverse all items searching for id.
  getItemWithIdOf(id, menuItems) {
    for (var i = 0 ; i < menuItems.length ; i++) {
      const menuItem = menuItems[i]; 
      if (("id" in menuItem) && (menuItem["id"] == id))
        return menuItem;
      if (("subMenuItems" in menuItem)) {
        const result = this.getItemWithIdOf(id, menuItem["subMenuItems"]);
        if (result != null) {
          return result;
        }
      }
    }
    return null;
  }

  // Update menu in case the item objects has changed
  update() {
    // Remove all items
    while (this.menuBarElement.firstChild) {
      this.menuBarElement.removeChild(this.menuBarElement.firstChild);
    }

    // Reset state
    this.stateOpen = false;
    this.stateFocus = false;

    // Re-parse the elements
    this.parseMenuItems(this.menuBarElement, this.menuItems);
  }
    
}