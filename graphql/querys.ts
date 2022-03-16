import { gql } from "@apollo/client";

const GET_DISHES = gql`
  query {
    getDishes {
      name
      id
      price {
        offer_price
        now_price
      }
    }
  }
`;

const GET_MENUS = gql`
  query {
    getMenus {
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
  GET_DISHES,
  GET_MENUS
}