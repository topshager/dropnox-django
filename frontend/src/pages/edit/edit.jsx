import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from 'reactjs-popup';
import { useForm } from "react-hook-form";

function Edit(){

  const {register,handleSubmit,watch,formState:{errors}} = useForm();
  const onSubmit = data =>console.log(data);
  console.log(watch("example"));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="text" {...register("example")}/>


      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}

export default Edit
