import { queryAll, querySingle } from "app/libs/utils/gql";
import { toJS } from "mobx";
import upload from "app/services/upload";

const options = {
  auth: true,
  onError: (err: any) => {
    if (!!err) alert(err.errors[0].message);
  },
};

export const form = async (params) => {
  return await querySingle(
    `query MyQuery($id: Int) {
      t_sales_order(where: {id: {_eq: $id}}) {
        id
        no_faktur_pajak
        posted_kiss
        ppn
        purchase_order_number
        sales_order_date
        sales_order_number
        status
        est_delivery
        created_date
        created_by
        id_customer
        id_outlet
        sub_total
        grand_total
        discount
        amount_discount
        amount_ppn
        total_kg
        purchase_order_image
        t_sales_order_lines {
          ratio
          unit
          total
          qty
          price
          id_sales_order
          id_product
          id
          discount
          created_date
          created_by
          amount_discount
          qty_kg
          subtotal
        }
      }
    }`,
    {
      ...options,
      variables: params,
    }
  );
};

export const customer = async () => {
  return await queryAll(
    `query MyQuery {
        m_customer(order_by: {name: asc}) {
        id
        name
      }
    }`,
    {
      ...options,
    }
  );
};

export const customer_outlet = async () => {
  return await queryAll(
    `query MyQuery {
      m_customer_outlet(order_by: {name: asc}) {
        id
        id_customer
        name
        id_area
      }
    }`,
    {
      ...options,
    }
  );
};

export const product_unit = async () => {
  return await queryAll(
    `query MyQuery {
      m_product_unit(order_by: {unit: asc}) {
        id
        ratio
        unit
      }
    }`,
    {
      ...options,
    }
  );
};

export const product = async (params) => {
  const res = await queryAll(
    `query MyQuery($date: date) {
      m_product(order_by: {m_product_group: {name: asc}, name: asc}) {
        id
        name
        ratio_1
        ratio_2
        ratio_3
        ratio_4
        unit
        unit_1
        unit_2
        unit_3
        unit_4
        m_product_group {
          name
        }
        m_product_prices(where: {valid_until: {_gte: $date}}) {
          id
          id_area
          price_non_ppn
          unit
          valid_from
          valid_until
        }
      }
    }`,
    {
      ...options,
      variables: params,
    }
  );

  return res.filter((x) => {
    return x.m_product_prices.length > 0;
  });
};

export const save = async (id, meta) => {
  const data = toJS(meta.form);
  data.sales_order_date = new Date(data.sales_order_date).toDateString();
  data.est_delivery = new Date(data.est_delivery).toDateString();
  if (
    !!data.purchase_order_image &&
    data.purchase_order_image.indexOf("file://") > -1
  ) {
    data.purchase_order_image = await upload(data.purchase_order_image, "so");
  }
  if (!id) {
    const lines = data.t_sales_order_lines.map((x) => {
      x.price = x.price.toString().replace(/,/g, "") * 1;
      return x;
    });

    delete data.t_sales_order_lines;
    data.t_sales_order_lines = {
      data: lines,
    };

    return await queryAll(
      `mutation MyMutation($insert: [t_sales_order_insert_TextInput!]!) {
        __typename
        insert_t_sales_order(objects: $insert) {
          returning {
            id
          }
        }
      }`,
      {
        ...options,
        variables: {
          insert: [data],
        },
      }
    ).then(async (res) => {
      return res;
    });
  } else {
    const deleteLine = meta.t_sales_order_lines.map((x) => x.id);
    const lines = data.t_sales_order_lines.map((x) => {
      x.price = x.price.toString().replace(/,/g, "") * 1;
      return x;
    });
    delete data.t_sales_order_lines;
    return await queryAll(
      `mutation MyMutation($id: Int, $linesid: [Int!]!, $update: t_sales_order_set_TextInput, $lines: [t_sales_order_line_insert_TextInput!]!) {
        __typename
        update_t_sales_order(where: {id: {_eq: $id}}, _set: $update) {
          returning {
            id
          }
        }
        delete_t_sales_order_line(where: {id: {_in: $linesid}}) {
          returning {
            id
          }
        }
        insert_t_sales_order_line(objects: $lines) {
          returning {
            id
          }
        }
      }`,
      {
        ...options,
        variables: {
          update: data,
          lines,
          linesid: deleteLine,
          id,
        },
      }
    );
  }
};
