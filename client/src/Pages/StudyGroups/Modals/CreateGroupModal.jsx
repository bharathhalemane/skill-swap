import { useState } from "react";
import CommonModal from "../../../components/Utils/CommonModal";
import styles from './modal.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { createGroup } from "../../../redux/features/groups/groupsActions";
import { TailSpin } from "react-loader-spinner";

const CreateGroupModal = ({ title }) => {
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const { createLoading } = useSelector((state) => state.groups)
    const [data, setData] = useState({
        title: "",
        description: "",
        time: "",
        date: "",
        location: "",
        mode: "online",
        joinLink: "",
        maxMembers: 1
    })

    const handleChange = e => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(data)
        await dispatch(createGroup(data))

        if (!createLoading) {
            setIsOpen(false)
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className={styles.createGroupButton}>
                + {title}
            </button>

            <CommonModal title="Create Study Group" isOpen={isOpen} onClose={() => setIsOpen(false)} width="550px">
                <form action="" onSubmit={onSubmit} className={styles.modernForm}>
                    <div className={styles.formGroup}>
                        <label>Group Title</label>
                        <input type="text" name="title" value={data.title} onChange={handleChange} placeholder="Enter title" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea value={data.description} onChange={handleChange} name="description" placeholder="What will you cover> Any materials needed?" />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input value={data.date} onChange={handleChange} type="date" name="date" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label >Time</label>
                            <input value={data.time} onChange={handleChange} type="text" placeholder="09:00 AM" name="time" required />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Mode</label>
                            <select name="mode" onChange={handleChange}>
                                <option value="online" selected>Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Max Members</label>
                            <input type="number" value={data.maxMembers} onChange={handleChange} name="maxMembers" required />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        {
                            data.mode === "offline" ? <>
                                <label>Location</label>
                                <input value={data.location} onChange={handleChange} type="text" placeholder="Enter location to meet up" name="location" required />
                            </> : <>
                                <label>Join Link</label>
                                <input value={data.joinLink} onChange={handleChange} type="text" placeholder="Enter join link" name="joinLink" required />
                            </>
                        }
                    </div>

                    <div className={styles.modalButtons}>
                        <button className={styles.cancelBtn} onClick={() => setIsOpen(false)}>Cancel</button>
                        <button className={styles.saveBtn} type="submit">
                            {
                                createLoading ? <TailSpin width={20} height={20} color="#fff" /> : "Create"
                            }
                        </button>
                    </div>
                </form>
            </CommonModal>
        </>
    )
}

export default CreateGroupModal