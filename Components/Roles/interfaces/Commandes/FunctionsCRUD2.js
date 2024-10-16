import axios from 'axios';
export const deleteProduct = async (deletedata) => {
  console.log(deletedata);
  try {
    const response = await axios.put('http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/deleteligneachat.php', {
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
    const response = await axios.put('http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/updateligneachat.php', {
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
    const response = await axios.post('http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/addligneachat.php', {
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

  // console.log('lol',response.data);
  } catch (error) {
    console.error(error);
  }
};

