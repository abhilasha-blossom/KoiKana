import { useProgressContext } from '../context/ProgressContext';

const useProgress = () => {
    return useProgressContext();
};

export default useProgress;

