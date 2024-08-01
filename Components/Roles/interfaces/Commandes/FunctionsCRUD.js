import axios from 'axios';
import {URL} from '@env'
export const deleteProduct = async (deletedata) => {
  console.log(deletedata);
  try {
    const response = await axios.put( 'http://10.20.69.188/logo/Components/Roles/interfaces/phpfolderv2/deleteligne.php', {
      headers: {
        'Content-Type': 'application/json'
      },
      id:deletedata,
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const updateProduct = async (editeddata) => {
  try {
    console.log('lol',editeddata[0]);
    const response = await axios.put( 'http://10.20.69.188/logo/Components/Roles/interfaces/phpfolderv2/updateligne.php', {
      headers: {
        'Content-Type': 'application/json'
      },
      idlignecommande: editeddata[0],
      stock:editeddata[1],
    
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const AddProductToCommand = async (addedData) => {
  console.log(addedData);
  try {
    const response = await axios.post( 'http://10.20.69.188/logo/Components/Roles/interfaces/phpfolderv2/addproduct.php', {
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

