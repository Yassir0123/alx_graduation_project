import axios from 'axios';
export const deleteProduct = async (deletedata,quantiter,id_produit) => {
  console.log(deletedata,quantiter,id_produit);
  try {
    const response = await axios.put( 'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/deleteligne.php', {
      headers: {
        'Content-Type': 'application/json'
      },
      id:deletedata,
      quantiter:quantiter,
      idprod:id_produit,
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const updateProduct = async (editeddata) => {
  try {
    console.log('lol',editeddata);
    const response = await axios.put( 'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/updateligne.php', {
      headers: {
        'Content-Type': 'application/json'
      },
      idlignecommande: editeddata[0],
      stock:editeddata[1],
      idprod:editeddata[2],
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const AddProductToCommand = async (addedData) => {
  console.log(addedData);
  try {
    const response = await axios.post( 'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/addproduct.php', {
      headers: {

        'Content-Type': 'application/json'
      },
      idprod:addedData.idProduct,
      category:addedData.category,
      libeller:addedData.libeller,
      idcmd:addedData.idcmd,
      tva:addedData.tva,
      prix_ht:addedData.price,
      quantiter:addedData.quantiter,
    });

   console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

