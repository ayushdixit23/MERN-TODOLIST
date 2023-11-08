"use client";
import React, { useEffect, useState } from "react";
import { GrAdd } from "react-icons/gr";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "./API";

const Pages = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [state, setState] = useState({
    todo: "",
    check: false,
    editingTodoId: null,
  });

  const add = async () => {
    try {
      const datatoSend = {
        todo: state.todo,
        check: state.check,
      };
      if (!state.todo) return;
      if (state.editingTodoId) {
        const res = await axios.post(
          `${API}/edit/${state.editingTodoId}`,
          datatoSend
        );
        if (res.data.success) {
          setState({ todo: "", check: false, editingTodoId: null });
          fetchIt();
        }
      } else {
        const res = await axios.post(`${API}/add`, datatoSend);
        if (res.data.success) {
          setState({ ...state, todo: "" });
          fetchIt();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (tod, id, ch) => {
    setState({ ...state, todo: tod, editingTodoId: id, check: ch });
  };

  const handleCheckboxChange = async (todoId, newCheckState) => {
    try {
      const datatoSend = {
        check: newCheckState,
      };

      const res = await axios.post(`${API}/edit/${todoId}`, datatoSend);
      console.log(res.data);
      if (res.data.success) {
        const updatedData = data.map((d) => {
          if (d._id === todoId) {
            return { ...d, check: newCheckState };
          }
          return d;
        });

        setData(updatedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (i, todoid) => {
    console.log(i, todoid);
    const updateData = data.filter((g, l) => {
      return i != l;
    });
    setData(updateData);
    const res = await axios.delete(`${API}/delete/${todoid}`);
    console.log(res.data);
  };

  const fetchIt = async () => {
    const res = await axios.get(`${API}/fetchTodo`);
    setData(res.data);
  };

  console.log(data, "data");

  useEffect(() => {
    fetchIt();
  }, []);
  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center my-3 ">
          <div
            className="text-3xl font-semibold p-1 my-1
           border-b-2 border-black"
          >
            TodoList Project
          </div>
          <div className="flex flex-col justify-center my-5 items-center min-w-[300px] w-[35%]">
            <div className="flex justify-between items-center w-full gap-1 border-2 border-black rounded-lg px-2">
              <input
                value={state.todo}
                onChange={(e) => setState({ ...state, todo: e.target.value })}
                type="text"
                placeholder="Enter Your Todo"
                className="outline-none w-full rounded-lg p-2"
              />

              {state.editingTodoId ? (
                <BiSolidEdit onClick={add} className="text-xl cursor-pointer" />
              ) : (
                <GrAdd
                  onClick={add}
                  className="text-xl cursor-pointer h-full"
                />
              )}
            </div>
            <div className="flex flex-col gap-3 justify-center my-4 items-center w-full">
              {data?.map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between rounded-lg p-2 items-center border-2 border-black w-full"
                >
                  <div className="flex justify-center items-center gap-3">
                    <input
                      id={d?._id}
                      checked={d?.check}
                      onChange={() => handleCheckboxChange(d?._id, !d.check)}
                      type="checkbox"
                      className="w-5 h-5"
                    />
                    <div
                      className={` ${
                        d?.check ? "line-through" : null
                      } text-lg font-medium`}
                    >
                      {d?.todo}
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <BiSolidEdit
                      onClick={() => handleEdit(d?.todo, d?._id)}
                      className="text-xl cursor-pointer"
                    />
                    <RiDeleteBin6Fill
                      onClick={() => deleteTodo(i, d?._id)}
                      className="text-xl cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pages;
