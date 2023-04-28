import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

const Categories = ({swal}) => {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
        })
    }

    const saveCategory = async (e) => {
        e.preventDefault()
        const data = {name, parentCategory}
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }
        setName('')
        fetchCategories()
    }

    const editCategory = (category) => {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
    }

    const deleteCategory = (category) => {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category
                await axios.delete(`/api/categories?_id=${_id}`)
                fetchCategories()
            }
        })
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory 
                ? `Edit category ${editedCategory.name}` 
                : 'Create new category'}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    value={name} 
                    className="mb-0" 
                    type="text" 
                    placeholder={'Category name'} 
                    onChange={e => setName(e.target.value)}
                />
                <select 
                    className="mb-0"
                    onChange={e => setParentCategory(e.target.value)} 
                    value={parentCategory}
                >
                    <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category} value={category._id}>{category.name}</option>
                        ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(category)} className="btn-primary mr-1">Edit</button>
                                <button onClick={() => deleteCategory(category)} className="btn-primary">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories  swal={swal} />
) )