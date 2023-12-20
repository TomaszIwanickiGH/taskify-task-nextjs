import useTaskInfoModal from '../hooks/useTaskInfoModal';

export default toggleOverflow = () => {
  const taskInfoModal = useTaskInfoModal();

  if (taskInfoModal.isOpen) {
    document.body.classList.add('toggle-overflow');
  } else {
    document.body.classList.remove('toggle-overflow');
  }
};
