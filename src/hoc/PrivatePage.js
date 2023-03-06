import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { UserSelectors } from '../store/reducers/user';

export default function PrivatePage({Component}) { 
 const navigate = useNavigate()
 const currentUser = useSelector(UserSelectors.selectCurrentUser);
 
 if (!currentUser) {
  navigate('/sign-in')
  return
 }


 return <Component />
}