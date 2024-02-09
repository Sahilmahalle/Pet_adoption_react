import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState , lazy  
} from "react";
import AdoptedPetContext from "./AdoptedPetContext";

import ErrorBoundary from "./ErrorBoundary";
import fetchPet from "./fetchPet";
import Carousel from "./Carousel";

const Modal =lazy(()=>import("./Modal"));

const Details = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const results = useQuery(["details", id], fetchPet);
  // eslint-disable-next-line no-unused-vars
  const [_, setAdoptedPet] = useContext(AdoptedPetContext);

  if (results.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="loader text-4xl">🌀</h2>
      </div>
    );
  }

  const pet = results.data.pets[0];

  return (
    <div className="details grid-col-1 grid gap-8 p-8 md:grid-cols-2">
      <Carousel images={pet.images} />
      <div>
        <h1 className="mb-4 text-3xl font-bold">{pet.name}</h1>
        <h2 className="mb-2 text-xl text-gray-600">{`${pet.animal} — ${pet.breed} — ${pet.city}, ${pet.state}`}</h2>
        <button
          className="mr-2 rounded-md bg-orange-500 px-4 py-2 text-white"
          onClick={() => setShowModal(true)}
        >
          Adopt {pet.name}
        </button>
        <p className="mb-4 text-lg leading-relaxed">{pet.description}</p>
        {showModal ? (
          <Modal>
            <div className="flex flex-col items-center">
              <h1 className="mb-4 text-2xl font-bold">
                Would you like to adopt {pet.name}?
              </h1>
              <div className="buttons flex">
                <button
                  className="mr-2 rounded-md bg-green-500 px-4 py-2 text-white"
                  onClick={() => {
                    setAdoptedPet(pet);
                    navigate("/");
                  }}
                >
                  Yes
                </button>
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-white"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
