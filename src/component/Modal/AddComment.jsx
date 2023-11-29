import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Changed faXmark to faTimes
import LabelCheckbox from '../utils/LabelCheckbox/LabelCheckbox';
import Button from '../utils/Button/Button';

function AddComment({ avis, handleClose, setComments, comments, edit = null }) {
  const [comment, setComment] = useState('');
  const [asuivre, setAsuivre] = useState(avis === 'RMQ');

  useEffect(() => {
    if (edit !== null) {
      setComment(comments[edit].commentaire);
      setAsuivre(comments[edit].a_suivre);
    }
  }, [edit, comments]); // Added dependencies for useEffect

  return (
    <div
      id="defaultModal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-[#000a]"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-gray-300 rounded-lg shadow">
          <div className="flex justify-between items-center pr-6">
            <h3 className="text-xl font-semibold text-gray-900 p-6">
              {edit === null ? 'Ajouter' : 'Editer'} un commentaire
            </h3>
            <span className="text-xl cursor-pointer" onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} /> {/* Changed faXmark to faTimes */}
            </span>
          </div>
          <div className="px-6 space-y-6">
            <textarea
              name=""
              id=""
              className="w-full p-1"
              rows="5"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
            <LabelCheckbox
              checked={asuivre}
              label="A suivre"
              onChange={(e) => {
                setAsuivre(e.target.checked);
              }}
            />
          </div>
          <div className="flex items-center justify-between p-6 space-x-2 border-t border-gray-200 rounded-b">
            <Button
              action={() => {
                handleClose();
              }}
            >
              Retour
            </Button>
            <Button
              action={() => {
                if (edit === null) {
                  setComments([
                    ...comments,
                    {
                      commentaire: comment,
                      a_suivre: asuivre,
                    },
                  ]);
                } else {
                  setComments((prevComments) =>
                    prevComments.map((commentToEdit, index) => {
                      if (index === edit) {
                        commentToEdit.commentaire = comment;
                        commentToEdit.a_suivre = asuivre;
                      }
                      return commentToEdit;
                    })
                  );
                }
                handleClose();
              }}
            >
              {edit === null ? 'Creer' : 'Editer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddComment;
