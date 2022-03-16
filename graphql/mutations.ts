import { gql } from "@apollo/client";

const ADD_DISH = gql`
  mutation newDish ($dish: DishI) {
    newDish(dish: $dish) {
      id
      name
      price {
        now_price
        before_price
        offer_price
      }
    }
  }
`;

const ADD_MENU = gql`
  mutation registerMenu($menu: MenuI) {
    registerMenu(menu: $menu) {
      dishes{
        prepared_quantity
        dish {
          name
          id
        }
      }
    }
  }
`;

const UPDATE_MENU = gql`
  mutation  updateMenu ($dishes: UpdateMenuI) {
    updateMenu(dishes: $dishes) {
      id
      date_menu
      dishes {
        id
        dish {
          id
          name
          price {
            offer_price
            now_price
          }
        }
        prepared_quantity
      }
    }
  }
`;

export {
  ADD_DISH,
  ADD_MENU,
  UPDATE_MENU
}