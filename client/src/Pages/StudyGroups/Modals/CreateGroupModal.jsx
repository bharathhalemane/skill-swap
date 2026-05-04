import { useState } from "react";
import CommonModal from "../../../components/Utils/CommonModal";
import styles from './modal.module.css'


const CreateGroupModal = ({ title }) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button onClick={() => setIsOpen(true)} className={styles.createGroupButton}>
                + {title}
            </button>

            <CommonModal title="Create Study Group" isOpen={isOpen} onClose={() => setIsOpen(false)} width="550px">
                <form action="" className={styles.modernForm}>
                    <div className={styles.formGroup}>
                        <label>Group Title</label>
                        <input type="text" name="title" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea name="description" placeholder="What will you cover> Any materials needed?" />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input type="date" />
                        </div>
                        <div className={styles.formGroup}>
                            <label >Time</label>
                            <input type="time" />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Location</label>
                        <input type="text" />
                    </div>
                    <div className={styles.modalButtons}>
                        <button className={styles.cancelBtn} onClick={() => setIsOpen(false)}>Cancel</button>
                        <button className={styles.saveBtn}>Create</button>
                    </div>
                </form>
            </CommonModal>
        </>
    )
}

export default CreateGroupModal